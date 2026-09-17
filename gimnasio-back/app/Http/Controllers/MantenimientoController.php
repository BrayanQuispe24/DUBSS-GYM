<?php

namespace App\Http\Controllers;

use App\Actions\Inventario\CreateMantenimientoAction;
use App\Actions\Inventario\DeleteMantenimientoAction;
use App\Actions\Inventario\ListarMantenimientosAction;
use App\Actions\Inventario\UpdateMantenimientoAction;
use App\DTOs\Inventario\CreateMantenimientoDTO;
use App\DTOs\Inventario\UpdateMantenimientoDTO;
use App\Http\Requests\Inventario\CreateMantenimientoRequest;
use App\Http\Requests\Inventario\UpdateMantenimientoRequest;
use App\Models\Mantenimiento;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class MantenimientoController extends Controller
{
    public function index(ListarMantenimientosAction $action): JsonResponse
    {
        Gate::authorize('viewAny', Mantenimiento::class);
        $mantenimientos = $action->execute();
        return response()->json(['data' => $mantenimientos]);
    }

    public function store(CreateMantenimientoRequest $request, CreateMantenimientoAction $action): JsonResponse
    {
        Gate::authorize('create', Mantenimiento::class);
        $dto = CreateMantenimientoDTO::fromRequest($request);
        $mantenimiento = $action->execute($dto);
        return response()->json(['message' => 'Mantenimiento registrado exitosamente', 'data' => $mantenimiento->load('equipo')], 201);
    }

    public function show(Mantenimiento $mantenimiento): JsonResponse
    {
        Gate::authorize('view', $mantenimiento);
        return response()->json(['data' => $mantenimiento->load('equipo')]);
    }

    public function update(UpdateMantenimientoRequest $request, Mantenimiento $mantenimiento, UpdateMantenimientoAction $action): JsonResponse
    {
        Gate::authorize('update', $mantenimiento);
        $dto = UpdateMantenimientoDTO::fromRequest($request);
        $updated = $action->execute($mantenimiento, $dto);
        return response()->json(['message' => 'Mantenimiento actualizado exitosamente', 'data' => $updated->load('equipo')]);
    }

    public function destroy(Mantenimiento $mantenimiento, DeleteMantenimientoAction $action): JsonResponse
    {
        Gate::authorize('delete', $mantenimiento);
        $action->execute($mantenimiento);
        return response()->json(['message' => 'Mantenimiento eliminado exitosamente']);
    }
}
