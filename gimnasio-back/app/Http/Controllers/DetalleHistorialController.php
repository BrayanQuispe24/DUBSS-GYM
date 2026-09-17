<?php

namespace App\Http\Controllers;

use App\Actions\Historial\CreateDetalleHistorialAction;
use App\Actions\Historial\DeleteDetalleHistorialAction;
use App\Actions\Historial\UpdateDetalleHistorialAction;
use App\DTOs\Historial\CreateDetalleHistorialDTO;
use App\DTOs\Historial\UpdateDetalleHistorialDTO;
use App\Http\Requests\Historial\CreateDetalleHistorialRequest;
use App\Http\Requests\Historial\UpdateDetalleHistorialRequest;
use App\Models\DetalleHistorial;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class DetalleHistorialController extends Controller
{
    public function store(CreateDetalleHistorialRequest $request, CreateDetalleHistorialAction $action): JsonResponse
    {
        Gate::authorize('create', DetalleHistorial::class);
        $dto = CreateDetalleHistorialDTO::fromRequest($request);
        $detalle = $action->execute($dto);
        return response()->json([
            'message' => 'Detalle de historial creado exitosamente',
            'data' => $detalle,
        ], 201);
    }

    public function update(UpdateDetalleHistorialRequest $request, UpdateDetalleHistorialAction $action): JsonResponse
    {
        $dto = UpdateDetalleHistorialDTO::fromRequest($request);
        $detalleModel = DetalleHistorial::findOrFail($dto->id);
        Gate::authorize('update', $detalleModel);
        $detalle = $action->execute($dto);
        return response()->json([
            'message' => 'Detalle de historial actualizado exitosamente',
            'data' => $detalle,
        ]);
    }

    public function destroy(int $id, DeleteDetalleHistorialAction $action): JsonResponse
    {
        $detalleModel = DetalleHistorial::findOrFail($id);
        Gate::authorize('delete', $detalleModel);
        $action->execute($id);
        return response()->json([
            'message' => 'Detalle de historial eliminado exitosamente',
        ]);
    }
}
