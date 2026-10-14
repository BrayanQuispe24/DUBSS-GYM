<?php

namespace App\Policies;

use App\Models\DetalleHistorial;
use App\Models\Usuario;

class DetalleHistorialPolicy
{
    private function getRole(Usuario $user): string
    {
        return mb_strtolower($user->rol->nombre ?? '');
    }

    public function viewAny(Usuario $user): bool
    {
        $rol = $this->getRole($user);
        return in_array($rol, ['cliente', 'instructor', 'administrador'], true);
    }

    public function view(Usuario $user, DetalleHistorial $detalle): bool
    {
        $rol = $this->getRole($user);
        if ($rol === 'cliente') {
            return $detalle->historial->id_usuario === $user->id;
        }
        return in_array($rol, ['instructor', 'administrador'], true);
    }

    public function create(Usuario $user): bool
    {
        return $this->getRole($user) === 'cliente';
    }

    public function update(Usuario $user, DetalleHistorial $detalle): bool
    {
        $rol = $this->getRole($user);
        return $rol === 'cliente' && $detalle->historial->id_usuario === $user->id;
    }

    public function delete(Usuario $user, DetalleHistorial $detalle): bool
    {
        $rol = $this->getRole($user);
        return $rol === 'cliente' && $detalle->historial->id_usuario === $user->id;
    }
}
