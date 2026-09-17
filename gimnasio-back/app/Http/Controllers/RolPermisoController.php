<?php

namespace App\Http\Controllers;

use App\Actions\Seguridad\AsignarRolPermisosAction;
use App\DTOs\Seguridad\AsignarRolPermisoDTO;
use App\Http\Requests\Seguridad\AsignarRolPermisoRequest;
use App\Models\RolPermiso;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class RolPermisoController extends Controller
{
    public function store(AsignarRolPermisoRequest $request, AsignarRolPermisosAction $action): JsonResponse
    {
        Gate::authorize('assign', RolPermiso::class);
        $dto = AsignarRolPermisoDTO::fromRequest($request);
        $rol = $action->execute($dto);

        return response()->json([
            'message' => 'Permisos asignados al rol exitosamente',
            'data' => $rol,
        ]);
    }
}
