<?php

namespace App\Http\Controllers;

use App\Actions\Usuario\CreateUsuarioAction;
use App\Actions\Usuario\ListarUsuariosAction;
use App\Actions\Usuario\UpdateUsuarioAction;
use App\Actions\Usuario\UpdateEstadoUsuario;
use App\DTOs\Usuario\CreateUsuarioDTO;
use App\DTOs\Usuario\UpdateUsuarioDTO;
use App\DTOs\Usuario\UpdateEstadoUsuarioDTO;
use App\Http\Requests\Usuario\CreateUserRequest;
use App\Http\Requests\Usuario\UpdateUsuarioRequest;
use App\Http\Requests\Usuario\UpdateEstadoUsuarioRequest;
use App\Models\Usuario;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class UsuarioController extends Controller
{

    public function index(Request $request, ListarUsuariosAction $action): JsonResponse
    {
        Gate::authorize('list', Usuario::class);
        $usuarios = $action->execute($request->all(), $request->user());
        return response()->json([
            'message' => 'Usuarios listados exitosamente',
            'data' => $usuarios,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        Gate::authorize('view', Usuario::class);
        $usuario = Usuario::with([
            'rol',
            'historiales.detalles',
            'historiales.antecedentes',
            'documentos.tipoDocumento',
        ])->findOrFail($id);

        return response()->json([
            'message' => 'Detalles del usuario obtenidos exitosamente',
            'data' => $usuario,
        ]);
    }

    public function store(CreateUserRequest $request, CreateUsuarioAction $action): JsonResponse
    {
        $dto = CreateUsuarioDTO::fromRequest($request);
        Gate::authorize('register', [Usuario::class, $dto]);
        $usuario = $action->execute($dto);
        return response()->json([
            'message' => 'Usuario creado exitosamente',
            'data' => $usuario,
        ]);
    }

    public function update(UpdateUsuarioRequest $request, UpdateUsuarioAction $action): JsonResponse
    {
        $dto = UpdateUsuarioDTO::fromRequest($request);
        $usuarioModel = Usuario::findOrFail($dto->id);
        Gate::authorize('update', $usuarioModel);
        $usuario = $action->execute($dto);
        return response()->json([
            'message' => 'Usuario actualizado exitosamente',
            'data' => $usuario,
        ]);
    }

    public function updateEstado(UpdateEstadoUsuarioRequest $request, UpdateEstadoUsuario $action): JsonResponse
    {
        $dto = UpdateEstadoUsuarioDTO::fromRequest($request);
        Gate::authorize('updateEstado', Usuario::class);
        $usuario = $action->execute($dto);
        return response()->json([
            'message' => 'Estado del usuario actualizado exitosamente',
            'data' => $usuario,
        ]);
    }
}
