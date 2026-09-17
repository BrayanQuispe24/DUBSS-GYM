<?php

namespace App\Http\Controllers;

use App\Actions\Seguridad\CreatePermisoAction;
use App\Actions\Seguridad\DeletePermisoAction;
use App\Actions\Seguridad\ListarPermisosAction;
use App\Actions\Seguridad\UpdatePermisoAction;
use App\DTOs\Seguridad\CreatePermisoDTO;
use App\DTOs\Seguridad\UpdatePermisoDTO;
use App\Http\Requests\Seguridad\CreatePermisoRequest;
use App\Http\Requests\Seguridad\UpdatePermisoRequest;
use App\Models\Permiso;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class PermisoController extends Controller
{
    public function index(ListarPermisosAction $action): JsonResponse
    {
        Gate::authorize('viewAny', Permiso::class);
        $permisos = $action->execute();
        return response()->json([
            'message' => 'Permisos listados exitosamente',
            'data' => $permisos,
        ]);
    }

    public function store(CreatePermisoRequest $request, CreatePermisoAction $action): JsonResponse
    {
        Gate::authorize('create', Permiso::class);
        $dto = CreatePermisoDTO::fromRequest($request);
        $permiso = $action->execute($dto);
        return response()->json([
            'message' => 'Permiso creado exitosamente',
            'data' => $permiso,
        ], 201);
    }

    public function update(UpdatePermisoRequest $request, UpdatePermisoAction $action): JsonResponse
    {
        Gate::authorize('update', Permiso::class);
        $dto = UpdatePermisoDTO::fromRequest($request);
        $permiso = $action->execute($dto);
        return response()->json([
            'message' => 'Permiso actualizado exitosamente',
            'data' => $permiso,
        ]);
    }

    public function destroy(int $id, DeletePermisoAction $action): JsonResponse
    {
        Gate::authorize('delete', Permiso::class);
        $action->execute($id);
        return response()->json([
            'message' => 'Permiso eliminado exitosamente',
        ]);
    }
}
