<?php

namespace App\Http\Controllers;

use App\Actions\Seguridad\CreateRolAction;
use App\Actions\Seguridad\DeleteRolAction;
use App\Actions\Seguridad\ListarRolesAction;
use App\Actions\Seguridad\UpdateRolAction;
use App\DTOs\Seguridad\CreateRolDTO;
use App\DTOs\Seguridad\UpdateRolDTO;
use App\Http\Requests\Seguridad\CreateRolRequest;
use App\Http\Requests\Seguridad\UpdateRolRequest;
use App\Models\Rol;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class RolController extends Controller
{
    public function index(ListarRolesAction $action): JsonResponse
    {
        Gate::authorize('viewAny', Rol::class);
        $roles = $action->execute();
        return response()->json([
            'message' => 'Roles listados exitosamente',
            'data' => $roles,
        ]);
    }

    public function store(CreateRolRequest $request, CreateRolAction $action): JsonResponse
    {
        Gate::authorize('create', Rol::class);
        $dto = CreateRolDTO::fromRequest($request);
        $rol = $action->execute($dto);
        return response()->json([
            'message' => 'Rol creado exitosamente',
            'data' => $rol,
        ], 201);
    }

    public function update(UpdateRolRequest $request, UpdateRolAction $action): JsonResponse
    {
        Gate::authorize('update', Rol::class);
        $dto = UpdateRolDTO::fromRequest($request);
        $rol = $action->execute($dto);
        return response()->json([
            'message' => 'Rol actualizado exitosamente',
            'data' => $rol,
        ]);
    }

    public function destroy(int $id, DeleteRolAction $action): JsonResponse
    {
        Gate::authorize('delete', Rol::class);
        $action->execute($id);
        return response()->json([
            'message' => 'Rol eliminado exitosamente',
        ]);
    }
}
