<?php

namespace App\Actions\Tramite;

use App\Models\BoletaPago;
use App\Models\FormularioSolicitud;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class UpdateEstadoFormularioSolicitudAction
{
    public function execute(int $id, string $nuevoEstado): FormularioSolicitud
    {
        $estadoLower = strtolower($nuevoEstado);
        $formulario = FormularioSolicitud::with(['disciplina', 'disciplinaHorario.horario', 'plan.tarifa', 'usuario', 'boletasPago'])->findOrFail($id);

        // Validar si el pago ya fue verificado y se emitió la inscripción
        $pagoCompletado = $formulario->boletasPago()->where('estado', 'completado')->exists();
        if ($pagoCompletado) {
            throw ValidationException::withMessages([
                'estado' => ['No se puede modificar el estado de la solicitud porque el pago en Caja Campus ya fue verificado y la Boleta de Inscripción fue emitida.'],
            ]);
        }

        return DB::transaction(function () use ($formulario, $estadoLower) {
            $formulario->update(['estado' => $estadoLower]);

            if ($estadoLower === 'aprobado') {
                $boletaExistente = BoletaPago::where('id_formulario', $formulario->id)->exists();
                if (! $boletaExistente) {
                    $numBoleta = 'PAG-'.date('Y').'-'.str_pad((string) $formulario->id, 5, '0', STR_PAD_LEFT);
                    $monto = $formulario->plan?->tarifa?->precio ?? 150.00;
                    $nombreDisc = $formulario->disciplina?->nombre ?? 'Gimnasio';

                    BoletaPago::create([
                        'numero_boleta' => $numBoleta,
                        'fecha_pago' => null,
                        'monto' => $monto,
                        'metodo_pago' => 'Caja Campus UAGRM',
                        'concepto' => "Pago de Inscripción / Membresía - {$nombreDisc}",
                        'estado' => 'pendiente',
                        'id_formulario' => $formulario->id,
                    ]);
                }
            }

            return $formulario->fresh(['disciplina', 'disciplinaHorario.horario', 'plan.tarifa', 'usuario', 'boletasPago']);
        });
    }
}
