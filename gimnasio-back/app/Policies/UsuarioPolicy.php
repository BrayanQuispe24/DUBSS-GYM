<?php

namespace App\Policies;

use App\DTOs\Auth\RegisterUserDTO;
use App\DTOs\Usuario\CreateUsuarioDTO;
use App\Models\Rol;
use App\Models\Usuario;
use Illuminate\Auth\Access\Response;

class UsuarioPolicy
{
    public function register(?Usuario $authUser, RegisterUserDTO|CreateUsuarioDTO $dto): Response
    {
        $authUser = $authUser ?? auth('sanctum')->user();

        // Si el usuario autenticado tiene rol Instructor, denegar terminantemente
        if ($authUser !== null && strcasecmp($authUser->rol?->nombre ?? '', 'Instructor') === 0) {
            return Response::deny('No estás autorizado. Los usuarios con rol Instructor no pueden registrar usuarios.');
        }

        // 1. Si el rol deseado es 'Cliente', se permite el registro público
        if (strcasecmp($dto->rol, 'Cliente') === 0) {
            return Response::allow();
        }

        // 2. Si es otro rol (Recepcionista, Instructor, Administrador), solo Administrador logueado
        if ($authUser === null || strcasecmp($authUser->rol?->nombre ?? '', 'Administrador') !== 0) {
            return Response::deny("No estás autorizado. Solo los usuarios con rol Administrador pueden crear cuentas con el rol {$dto->rol}.");
        }
        return Response::allow();
    }

    public function viewProfile(Usuario $authUser, Usuario $targetUser): bool
    {
        return $authUser->id === $targetUser->id || strcasecmp($authUser->rol?->nombre ?? '', 'Administrador') === 0;
    }

    public function logout(Usuario $authUser): bool
    {
        return $authUser->currentAccessToken() !== null;
    }

    public function list(Usuario $authUser): bool
    {
        $rolNombre = strtolower($authUser->rol?->nombre ?? '');
        return in_array($rolNombre, ['administrador', 'instructor', 'recepcionista'], true);
    }

    public function view(Usuario $authUser): bool
    {
        $rolNombre = strtolower($authUser->rol?->nombre ?? '');
        return in_array($rolNombre, ['administrador', 'instructor', 'recepcionista'], true);
    }

    public function update(Usuario $authUser, Usuario $targetUser): bool
    {
        // 0. Los usuarios con rol Instructor no pueden editar usuarios
        if (strcasecmp($authUser->rol?->nombre ?? '', 'Instructor') === 0) {
            return false;
        }

        // 1. Si es Administrador, puede actualizar cualquier perfil de cualquier rol
        if (strcasecmp($authUser->rol?->nombre ?? '', 'Administrador') === 0) {
            return true;
        }
        // 2. Cualquier otro rol solo puede actualizar su propio perfil
        return $authUser->id === $targetUser->id;
    }

    public function delete(Usuario $authUser, Usuario $targetUser): bool
    {
        if (strcasecmp($authUser->rol?->nombre ?? '', 'Instructor') === 0) {
            return false;
        }
        return strcasecmp($authUser->rol?->nombre ?? '', 'Administrador') === 0;
    }

    /**
     * Permite cambiar el estado (activo/suspendido) únicamente si es Administrador.
     */
    public function updateEstado(Usuario $authUser): bool
    {
        return strcasecmp($authUser->rol?->nombre ?? '', 'Administrador') === 0;
    }
}
