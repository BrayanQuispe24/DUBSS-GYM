<?php

namespace App\Policies;

use App\Models\Usuario;

class FormularioSolicitudPolicy
{
    private function canView(Usuario $user): bool
    {
        $user->loadMissing('rol');
        $rol = mb_strtolower($user->rol ? $user->rol->nombre : ($user->tipo_usuario ?? 'cliente'));

        return $rol !== 'instructor';
    }

    private function isStaff(Usuario $user): bool
    {
        $user->loadMissing('rol');
        $rol = mb_strtolower($user->rol ? $user->rol->nombre : ($user->tipo_usuario ?? 'cliente'));

        return in_array($rol, ['administrador', 'recepcionista'], true);
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
        $user->loadMissing('rol');
        $rol = mb_strtolower($user->rol ? $user->rol->nombre : ($user->tipo_usuario ?? 'cliente'));

        return $rol === 'cliente';
    }

    public function update(Usuario $user): bool
    {
        return $this->isStaff($user);
    }

    public function delete(Usuario $user): bool
    {
        return $this->isStaff($user);
    }
}
