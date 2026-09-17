<?php

namespace App\Policies;

use App\Models\Usuario;

class RolPermisoPolicy
{
    private function isAdmin(Usuario $user): bool
    {
        return mb_strtolower($user->rol->nombre ?? '') === 'administrador';
    }

    public function assign(Usuario $user): bool
    {
        return $this->isAdmin($user);
    }
}
