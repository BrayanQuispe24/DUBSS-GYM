<?php

namespace App\Policies;

use App\Models\Usuario;

class DisciplinaPolicy
{
    private function isAdmin(Usuario $user): bool
    {
        return mb_strtolower($user->rol->nombre ?? '') === 'administrador';
    }

    public function viewAny(Usuario $user): bool
    {
        return true; // Read allowed for all roles
    }

    public function view(Usuario $user): bool
    {
        return true; // Read allowed for all roles
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
