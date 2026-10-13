<?php

namespace App\Policies;

use App\Models\PlanEntrenamiento;
use App\Models\Usuario;

class PlanEntrenamientoPolicy
{
    private function canManage(Usuario $user): bool
    {
        $user->loadMissing('rol');
        $rol = mb_strtolower($user->rol ? $user->rol->nombre : ($user->tipo_usuario ?? 'cliente'));

        return in_array($rol, ['administrador', 'instructor'], true);
    }

    public function viewAny(Usuario $user): bool
    {
        return true;
    }

    public function view(Usuario $user, PlanEntrenamiento $plan): bool
    {
        return $this->canManage($user) || (int) $plan->id_usuario === (int) $user->id;
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
