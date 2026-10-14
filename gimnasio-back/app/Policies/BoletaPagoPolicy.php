<?php

namespace App\Policies;

use App\Models\BoletaPago;
use App\Models\Usuario;

class BoletaPagoPolicy
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

    public function view(Usuario $user, BoletaPago $boleta): bool
    {
        if ($this->isStaff($user)) {
            return true;
        }

        $idUsuarioPropietario = $boleta->formularioSolicitud?->id_usuario;

        return $idUsuarioPropietario && (int) $idUsuarioPropietario === (int) $user->id;
    }

    public function create(Usuario $user): bool
    {
        return $this->canView($user);
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
