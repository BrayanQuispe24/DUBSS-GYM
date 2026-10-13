<?php

namespace App\Http\Controllers;

use App\Actions\Tramite\CreateFormularioSolicitudAction;
use App\Actions\Tramite\ListarFormulariosSolicitudAction;
use App\Actions\Tramite\UpdateEstadoFormularioSolicitudAction;
use App\DTOs\Tramite\CreateFormularioSolicitudDTO;
use App\Http\Requests\Tramite\CreateFormularioSolicitudRequest;
use App\Models\FormularioSolicitud;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class FormularioSolicitudController extends Controller
{
    public function index(ListarFormulariosSolicitudAction $action): JsonResponse
    {
        Gate::authorize('viewAny', FormularioSolicitud::class);
        $formularios = $action->execute(auth()->user());

        return response()->json([
            'message' => 'Formularios de solicitud listados exitosamente',
            'data' => $formularios,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        Gate::authorize('view', FormularioSolicitud::class);
        $formulario = FormularioSolicitud::with(['disciplina', 'disciplinaHorario.horario', 'usuario', 'boletasPago'])->findOrFail($id);

        return response()->json([
            'message' => 'Detalle del formulario de solicitud obtenido exitosamente',
            'data' => $formulario,
        ]);
    }

    public function store(CreateFormularioSolicitudRequest $request, CreateFormularioSolicitudAction $action): JsonResponse
    {
        Gate::authorize('create', FormularioSolicitud::class);
        $dto = CreateFormularioSolicitudDTO::fromRequest($request);
        $formulario = $action->execute($dto);

        return response()->json([
            'message' => 'Formulario de solicitud creado exitosamente',
            'data' => $formulario,
        ], 201);
    }

    public function updateEstado(Request $request, int $id, UpdateEstadoFormularioSolicitudAction $action): JsonResponse
    {
        Gate::authorize('update', FormularioSolicitud::class);
        $request->validate([
            'estado' => 'required|string|in:pendiente,aprobado,rechazado,cancelado',
        ]);

        $formulario = $action->execute($id, $request->input('estado'));

        return response()->json([
            'message' => strtolower($request->input('estado')) === 'aprobado'
                ? 'Solicitud aprobada y Boleta de Pago para Caja Campus generada automáticamente'
                : 'Estado de la solicitud actualizado exitosamente',
            'data' => $formulario,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        Gate::authorize('delete', FormularioSolicitud::class);
        $formulario = FormularioSolicitud::findOrFail($id);
        $formulario->delete();

        return response()->json([
            'message' => 'Formulario de solicitud eliminado exitosamente',
        ]);
    }
}
