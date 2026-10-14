<?php

namespace App\Actions\Tramite;

use App\DTOs\Tramite\CreateFormularioSolicitudDTO;
use App\Models\Antecedente;
use App\Models\DetalleHistorial;
use App\Models\DisciplinaHorario;
use App\Models\FormularioSolicitud;
use App\Models\Historial;
use Illuminate\Validation\ValidationException;

class CreateFormularioSolicitudAction
{
    public function execute(CreateFormularioSolicitudDTO $dto): FormularioSolicitud
    {
        $userId = auth()->id() ?? $dto->idUsuario;

        // Monthly restriction: Max 1 active request per discipline per user in current month
        $now = now();
        $existeSolicitudMes = FormularioSolicitud::where('id_usuario', $userId)
            ->where('id_disciplina', $dto->idDisciplina)
            ->whereYear('created_at', $now->year)
            ->whereMonth('created_at', $now->month)
            ->whereIn('estado', ['pendiente', 'aprobado'])
            ->exists();

        if ($existeSolicitudMes) {
            throw ValidationException::withMessages([
                'id_disciplina' => ['Ya cuenta con una solicitud activa para esta disciplina en el mes actual.'],
            ]);
        }

        // Quota capacity validation
        if ($dto->idDisciplinaHorario) {
            $dh = DisciplinaHorario::find($dto->idDisciplinaHorario);
            if ($dh && $dh->cupos_disponibles <= 0) {
                throw ValidationException::withMessages([
                    'horario' => ['No hay cupos disponibles para el horario seleccionado.'],
                ]);
            }
        }

        $formulario = FormularioSolicitud::create([
            'numero_formulario' => $dto->numeroFormulario,
            'id_disciplina' => $dto->idDisciplina,
            'id_disciplina_horario' => $dto->idDisciplinaHorario,
            'id_plan' => $dto->idPlan,
            'id_usuario' => $userId,
            'estado' => $dto->estado,
            'fecha_registro' => $dto->fechaRegistro ?? now(),
        ]);

        // Find or create user Historial
        $historial = Historial::firstOrCreate(
            ['id_usuario' => $userId],
            ['fecha_apertura' => now()]
        );

        // Update Historial personal info if provided
        $historialData = array_filter([
            'facultad_carrera' => $dto->facultadCarrera,
            'domicilio' => $dto->domicilio,
            'celular_emergencia' => $dto->celular,
            'sexo' => $dto->sexo,
            'grupo_sanguineo' => $dto->grupoSanguineo,
            'fecha_nacimiento' => $dto->fechaNacimiento,
        ], fn ($val) => $val !== null);

        if (! empty($historialData)) {
            $historial->update($historialData);
        }

        // Save physical measurement if height/weight provided
        if ($dto->peso !== null || $dto->altura !== null) {
            $imc = null;
            if ($dto->peso && $dto->altura && $dto->altura > 0) {
                $alturaM = $dto->altura > 3 ? $dto->altura / 100 : $dto->altura;
                $imc = round($dto->peso / ($alturaM * $alturaM), 2);
            }

            DetalleHistorial::create([
                'id_historial' => $historial->id,
                'peso' => $dto->peso,
                'altura' => $dto->altura,
                'imc' => $imc,
                'fecha_registro' => now(),
            ]);
        }

        // Save Antecedentes médicos if provided
        if (is_array($dto->antecedentes)) {
            $antData = array_merge($dto->antecedentes, ['id_historial' => $historial->id]);
            Antecedente::create($antData);
        }

        return $formulario->load(['disciplina', 'disciplinaHorario.horario', 'plan.tarifa', 'usuario.historiales.antecedentes']);
    }
}
