<?php

namespace App\Http\Controllers;

use App\Actions\Historial\CreateHistorialAction;
use App\Actions\Historial\DeleteHistorialAction;
use App\Actions\Historial\ListarHistorialesAction;
use App\Actions\Historial\UpdateHistorialAction;
use App\DTOs\Historial\CreateHistorialDTO;
use App\DTOs\Historial\UpdateHistorialDTO;
use App\Http\Requests\Historial\CreateHistorialRequest;
use App\Http\Requests\Historial\UpdateHistorialRequest;
use App\Models\Historial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class HistorialController extends Controller
{
    public function index(Request $request, ListarHistorialesAction $action): JsonResponse
    {
        Gate::authorize('viewAny', Historial::class);
        $historiales = $action->execute($request->user());
        return response()->json([
            'message' => 'Historiales listados exitosamente',
            'data' => $historiales,
        ]);
    }

    public function store(CreateHistorialRequest $request, CreateHistorialAction $action): JsonResponse
    {
        Gate::authorize('create', Historial::class);
        $dto = CreateHistorialDTO::fromRequest($request);
        $historial = $action->execute($dto, $request->user());
        return response()->json([
            'message' => 'Historial creado exitosamente',
            'data' => $historial,
        ], 201);
    }

    public function update(UpdateHistorialRequest $request, UpdateHistorialAction $action): JsonResponse
    {
        $dto = UpdateHistorialDTO::fromRequest($request);
        $historialModel = Historial::findOrFail($dto->id);
        Gate::authorize('update', $historialModel);
        $historial = $action->execute($dto);
        return response()->json([
            'message' => 'Historial actualizado exitosamente',
            'data' => $historial,
        ]);
    }

    public function destroy(int $id, DeleteHistorialAction $action): JsonResponse
    {
        $historialModel = Historial::findOrFail($id);
        Gate::authorize('delete', $historialModel);
        $action->execute($id);
        return response()->json([
            'message' => 'Historial eliminado exitosamente',
        ]);
    }
}
