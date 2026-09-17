<?php

namespace App\Http\Controllers;

use App\Actions\Inventario\CreateTipoEquipoAction;
use App\Actions\Inventario\DeleteTipoEquipoAction;
use App\Actions\Inventario\ListarTipoEquiposAction;
use App\Actions\Inventario\UpdateTipoEquipoAction;
use App\DTOs\Inventario\CreateTipoEquipoDTO;
use App\DTOs\Inventario\UpdateTipoEquipoDTO;
use App\Http\Requests\Inventario\CreateTipoEquipoRequest;
use App\Http\Requests\Inventario\UpdateTipoEquipoRequest;
use App\Models\TipoEquipo;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class TipoEquipoController extends Controller
{
    public function index(ListarTipoEquiposAction $action): JsonResponse
    {
        Gate::authorize('viewAny', TipoEquipo::class);
        $tipos = $action->execute();
        return response()->json(['data' => $tipos]);
    }

    public function store(CreateTipoEquipoRequest $request, CreateTipoEquipoAction $action): JsonResponse
    {
        Gate::authorize('create', TipoEquipo::class);
        $dto = CreateTipoEquipoDTO::fromRequest($request);
        $tipo = $action->execute($dto);
        return response()->json(['message' => 'Tipo de equipo creado exitosamente', 'data' => $tipo], 201);
    }

    public function show(TipoEquipo $tipoEquipo): JsonResponse
    {
        Gate::authorize('view', $tipoEquipo);
        return response()->json(['data' => $tipoEquipo]);
    }

    public function update(UpdateTipoEquipoRequest $request, TipoEquipo $tipoEquipo, UpdateTipoEquipoAction $action): JsonResponse
    {
        Gate::authorize('update', $tipoEquipo);
        $dto = UpdateTipoEquipoDTO::fromRequest($request);
        $updated = $action->execute($tipoEquipo, $dto);
        return response()->json(['message' => 'Tipo de equipo actualizado exitosamente', 'data' => $updated]);
    }

    public function destroy(TipoEquipo $tipoEquipo, DeleteTipoEquipoAction $action): JsonResponse
    {
        Gate::authorize('delete', $tipoEquipo);
        $action->execute($tipoEquipo);
        return response()->json(['message' => 'Tipo de equipo eliminado exitosamente']);
    }
}
