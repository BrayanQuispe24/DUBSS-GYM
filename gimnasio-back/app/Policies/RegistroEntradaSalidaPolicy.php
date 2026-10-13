<?php

namespace App\Policies;

use App\Models\Usuario;

class RegistroEntradaSalidaPolicy
{
    private function canManage(Usuario $user): bool
    {
        $rol = mb_strtolower($user->rol->nombre ?? '');

        return in_array($rol, ['administrador', 'instructor']);
    }

    public function viewAny(Usuario $user): bool
    {
        return true;
    }

    public function view(Usuario $user): bool
    {
        return true;
    }

    public function create(Usuario $user): bool
    {
        return true; // Puede registrar marcación
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
