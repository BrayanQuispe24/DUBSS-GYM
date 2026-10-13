<?php

namespace App\Policies;

use App\Models\Usuario;

class PlanPolicy
{
    private function canView(Usuario $user): bool
    {
        $user->loadMissing('rol');
        $rol = mb_strtolower($user->rol ? $user->rol->nombre : ($user->tipo_usuario ?? 'cliente'));

        return $rol !== 'instructor';
    }

    private function isAdmin(Usuario $user): bool
    {
        $user->loadMissing('rol');
        return mb_strtolower($user->rol->nombre ?? '') === 'administrador';
    }

    public function viewAny(Usuario $user): bool
    {
        return $this->canView($user);
    }

    public function view(Usuario $user): bool
    {
        return $this->canView($user);
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
