<?php

namespace App\Http\Controllers;

use App\Actions\Auth\LoginUserAction;
use App\Actions\Auth\LogoutAction;
use App\Actions\Auth\RegisterUserAction;
use App\DTOs\Auth\LoginUserDTO;
use App\DTOs\Auth\RegisterUserDTO;
use App\Http\Requests\Auth\AuthLoginRequest;
use App\Http\Requests\Auth\AuthRegisterRequest;
use App\Models\Usuario;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class AuthController extends Controller
{
    public function register(AuthRegisterRequest $request, RegisterUserAction $action): JsonResponse
    {
        $dto = RegisterUserDTO::fromRequest($request);
        Gate::authorize('register', [Usuario::class, $dto]);
        $result = $action->execute($dto);

        return response()->json([
            'message' => 'Usuario registrado exitosamente',
            'user' => $result['usuario'],
            'access_token' => $result['token'],
            'token_type' => $result['token_type'],
        ], 201);
    }

    public function login(AuthLoginRequest $request, LoginUserAction $action): JsonResponse
    {
        $dto = LoginUserDTO::fromRequest($request);
        $result = $action->execute($dto);

        return response()->json([
            'message' => 'Inicio de sesión exitoso',
            'user' => $result['usuario'],
            'access_token' => $result['token'],
            'token_type' => $result['token_type'],
        ], 200);
    }

    public function logout(Request $request, LogoutAction $logoutAction): JsonResponse
    {
        // Autorización mediante Gate Facade
        Gate::authorize('logout', $request->user());

        $logoutAction->execute($request->user());

        return response()->json([
            'message' => 'Sesión cerrada exitosamente',
        ], 200);
    }

    public function profile(Request $request): JsonResponse
    {
        $user = $request->user();
        Gate::authorize('viewProfile', [$user, $user]);
        $user->load('rol');

        return response()->json($user);
    }
}
