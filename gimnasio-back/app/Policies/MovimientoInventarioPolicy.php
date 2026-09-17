<?php

namespace App\Policies;

use App\Models\Usuario;

class MovimientoInventarioPolicy
{
    private function isAdmin(Usuario $user): bool
    {
        return mb_strtolower($user->rol->nombre ?? '') === 'administrador';
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
        return $this->isAdmin($user);
    }

    public function update(Usuario $user): bool
    {
        return $this->isAdmin($user);
    }

    public function delete(Usuario $user): bool
    {
        return $this->isAdmin($user);
    }
}
