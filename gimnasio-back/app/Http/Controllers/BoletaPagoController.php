<?php

namespace App\Http\Controllers;

use App\Actions\Tramite\CreateBoletaPagoAction;
use App\Actions\Tramite\ListarBoletasPagoAction;
use App\DTOs\Tramite\CreateBoletaPagoDTO;
use App\Http\Requests\Tramite\CreateBoletaPagoRequest;
use App\Models\BoletaInscripcion;
use App\Models\BoletaPago;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class BoletaPagoController extends Controller
{
    public function index(Request $request, ListarBoletasPagoAction $action): JsonResponse
    {
        Gate::authorize('viewAny', BoletaPago::class);
        $boletas = $action->execute($request->user());

        return response()->json([
            'message' => 'Boletas de pago listadas exitosamente',
            'data' => $boletas,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        Gate::authorize('view', BoletaPago::class);
        $boleta = BoletaPago::with('formularioSolicitud.usuario')->findOrFail($id);

        return response()->json([
            'message' => 'Detalle de la boleta de pago obtenido exitosamente',
            'data' => $boleta,
        ]);
    }

    public function store(CreateBoletaPagoRequest $request, CreateBoletaPagoAction $action): JsonResponse
    {
        Gate::authorize('create', BoletaPago::class);
        $dto = CreateBoletaPagoDTO::fromRequest($request);
        $boleta = $action->execute($dto);

        return response()->json([
            'message' => 'Boleta de pago creada exitosamente',
            'data' => $boleta,
        ], 201);
    }

    public function emitirInscripcion(Request $request, int $id): JsonResponse
    {
        Gate::authorize('create', BoletaInscripcion::class);

        $request->validate([
            'numero_comprobante' => 'nullable|string|max:100',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'nullable|date',
        ]);

        $boletaPago = BoletaPago::with(['formularioSolicitud.disciplina', 'formularioSolicitud.disciplinaHorario.horario', 'formularioSolicitud.usuario'])->findOrFail($id);

        $formulario = $boletaPago->formularioSolicitud;
        if (! $formulario) {
            return response()->json(['message' => 'No se encontró el formulario de solicitud asociado a esta boleta de pago.'], 422);
        }

        return DB::transaction(function () use ($boletaPago, $formulario, $request) {
            $boletaPago->update([
                'estado' => 'completado',
                'fecha_pago' => now(),
                'comprobante_url' => $request->input('numero_comprobante'),
            ]);

            $fechaInicio = $request->input('fecha_inicio', now()->toDateString());
            $fechaFin = $request->input('fecha_fin', now()->addDays(30)->toDateString());
            $numInscripcion = 'INS-'.date('Y').'-'.str_pad((string) $formulario->id, 5, '0', STR_PAD_LEFT);

            $dh = $formulario->disciplinaHorario;
            $h = $dh?->horario;

            $boletaInscripcion = BoletaInscripcion::create([
                'numero_boleta' => $numInscripcion,
                'fecha_inscripcion' => now()->toDateString(),
                'fecha_inicio' => $fechaInicio,
                'fecha_fin' => $fechaFin,
                'monto' => $boletaPago->monto,
                'estado' => 'activo',
                'disciplina' => $formulario->disciplina?->nombre ?? 'Gimnasio',
                'hora_inicio' => $h?->hora_inicio ?? $h?->inicio,
                'hora_salida' => $h?->hora_fin ?? $h?->fin,
                'id_usuario' => $formulario->id_usuario,
                'id_disciplina_horario' => $formulario->id_disciplina_horario,
                'id_disciplina' => $formulario->id_disciplina,
            ]);

            return response()->json([
                'message' => 'Pago de Caja Campus validado y Boleta de Inscripción emitida con éxito',
                'data' => [
                    'boleta_pago' => $boletaPago->fresh(),
                    'boleta_inscripcion' => $boletaInscripcion->load('usuario'),
                ],
            ]);
        });
    }

    public function destroy(int $id): JsonResponse
    {
        Gate::authorize('delete', BoletaPago::class);
        $boleta = BoletaPago::findOrFail($id);
        $boleta->delete();

        return response()->json([
            'message' => 'Boleta de pago eliminada exitosamente',
        ]);
    }
}
