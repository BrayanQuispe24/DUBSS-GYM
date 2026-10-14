<?php

namespace App\Policies;

use App\Models\BoletaInscripcion;
use App\Models\Usuario;

class BoletaInscripcionPolicy
{
    private function isStaff(Usuario $user): bool
    {
        $user->loadMissing('rol');
        $rol = mb_strtolower($user->rol ? $user->rol->nombre : ($user->tipo_usuario ?? 'cliente'));

        return in_array($rol, ['administrador', 'recepcionista'], true);
    }

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

    public function view(Usuario $user, BoletaInscripcion $boleta): bool
    {
        if ($this->isStaff($user)) {
            return true;
        }

        return (int) $boleta->id_usuario === (int) $user->id;
    }

    public function create(Usuario $user): bool
    {
        return $this->isStaff($user);
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
