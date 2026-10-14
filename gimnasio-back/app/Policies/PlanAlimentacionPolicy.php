<?php

namespace App\Policies;

use App\Models\Usuario;

class PlanAlimentacionPolicy
{
    private function canManage(Usuario $user): bool
    {
        $rol = mb_strtolower($user->rol->nombre ?? '');

        return in_array($rol, ['administrador', 'instructor']);
    }

    public function viewAny(Usuario $user): bool
    {
        $user->loadMissing('rol');
        $rol = mb_strtolower($user->rol ? $user->rol->nombre : ($user->tipo_usuario ?? ''));

        return $rol !== 'recepcionista';
    }

    public function view(Usuario $user): bool
    {
        $user->loadMissing('rol');
        $rol = mb_strtolower($user->rol ? $user->rol->nombre : ($user->tipo_usuario ?? ''));

        return $rol !== 'recepcionista';
    }

    public function create(Usuario $user): bool
    {
        return $this->canManage($user);
    }

    public function update(Usuario $user): bool
    {
        return $this->canManage($user);
    }

    public function delete(Usuario $user): bool
    {
        return $this->canManage($user);
    }
}
