<?php

namespace App\Http\Controllers;

use App\Actions\Inventario\CreateEquipoAction;
use App\Actions\Inventario\DeleteEquipoAction;
use App\Actions\Inventario\ListarEquiposAction;
use App\Actions\Inventario\UpdateEquipoAction;
use App\DTOs\Inventario\CreateEquipoDTO;
use App\DTOs\Inventario\UpdateEquipoDTO;
use App\Http\Requests\Inventario\CreateEquipoRequest;
use App\Http\Requests\Inventario\UpdateEquipoRequest;
use App\Models\Equipo;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class EquipoController extends Controller
{
    public function index(ListarEquiposAction $action): JsonResponse
    {
        Gate::authorize('viewAny', Equipo::class);
        $equipos = $action->execute();
        return response()->json(['data' => $equipos]);
    }

    public function store(CreateEquipoRequest $request, CreateEquipoAction $action): JsonResponse
    {
        Gate::authorize('create', Equipo::class);
        $dto = CreateEquipoDTO::fromRequest($request);
        $equipo = $action->execute($dto);
        return response()->json(['message' => 'Equipo creado exitosamente', 'data' => $equipo->load(['ambiente', 'marca', 'tipoEquipo'])], 201);
    }

    public function show(Equipo $equipo): JsonResponse
    {
        Gate::authorize('view', $equipo);
        return response()->json(['data' => $equipo->load(['ambiente', 'marca', 'tipoEquipo'])]);
    }

    public function update(UpdateEquipoRequest $request, Equipo $equipo, UpdateEquipoAction $action): JsonResponse
    {
        Gate::authorize('update', $equipo);
        $dto = UpdateEquipoDTO::fromRequest($request);
        $updated = $action->execute($equipo, $dto);
        return response()->json(['message' => 'Equipo actualizado exitosamente', 'data' => $updated->load(['ambiente', 'marca', 'tipoEquipo'])]);
    }

    public function destroy(Equipo $equipo, DeleteEquipoAction $action): JsonResponse
    {
        Gate::authorize('delete', $equipo);
        $action->execute($equipo);
        return response()->json(['message' => 'Equipo eliminado exitosamente']);
    }
}
