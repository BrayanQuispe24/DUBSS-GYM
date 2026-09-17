<?php

namespace App\Http\Controllers;

use App\Actions\Inventario\CreateTipoMovimientoAction;
use App\Actions\Inventario\DeleteTipoMovimientoAction;
use App\Actions\Inventario\ListarTipoMovimientosAction;
use App\Actions\Inventario\UpdateTipoMovimientoAction;
use App\DTOs\Inventario\CreateTipoMovimientoDTO;
use App\DTOs\Inventario\UpdateTipoMovimientoDTO;
use App\Http\Requests\Inventario\CreateTipoMovimientoRequest;
use App\Http\Requests\Inventario\UpdateTipoMovimientoRequest;
use App\Models\TipoMovimiento;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class TipoMovimientoController extends Controller
{
    public function index(ListarTipoMovimientosAction $action): JsonResponse
    {
        Gate::authorize('viewAny', TipoMovimiento::class);
        $tipos = $action->execute();
        return response()->json(['data' => $tipos]);
    }

    public function store(CreateTipoMovimientoRequest $request, CreateTipoMovimientoAction $action): JsonResponse
    {
        Gate::authorize('create', TipoMovimiento::class);
        $dto = CreateTipoMovimientoDTO::fromRequest($request);
        $tipo = $action->execute($dto);
        return response()->json(['message' => 'Tipo de movimiento creado exitosamente', 'data' => $tipo], 201);
    }

    public function show(TipoMovimiento $tipoMovimiento): JsonResponse
    {
        Gate::authorize('view', $tipoMovimiento);
        return response()->json(['data' => $tipoMovimiento]);
    }

    public function update(UpdateTipoMovimientoRequest $request, TipoMovimiento $tipoMovimiento, UpdateTipoMovimientoAction $action): JsonResponse
    {
        Gate::authorize('update', $tipoMovimiento);
        $dto = UpdateTipoMovimientoDTO::fromRequest($request);
        $updated = $action->execute($tipoMovimiento, $dto);
        return response()->json(['message' => 'Tipo de movimiento actualizado exitosamente', 'data' => $updated]);
    }

    public function destroy(TipoMovimiento $tipoMovimiento, DeleteTipoMovimientoAction $action): JsonResponse
    {
        Gate::authorize('delete', $tipoMovimiento);
        $action->execute($tipoMovimiento);
        return response()->json(['message' => 'Tipo de movimiento eliminado exitosamente']);
    }
}
