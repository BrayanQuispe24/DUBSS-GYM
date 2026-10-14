<?php

namespace App\Policies;

use App\Models\Antecedente;
use App\Models\Usuario;

class AntecedentePolicy
{
    private function getRole(Usuario $user): string
    {
        return mb_strtolower($user->rol->nombre ?? '');
    }

    public function viewAny(Usuario $user): bool
    {
        $rol = $this->getRole($user);
        return in_array($rol, ['cliente', 'instructor', 'administrador', 'recepcionista'], true);
    }

    public function view(Usuario $user, Antecedente $antecedente): bool
    {
        $rol = $this->getRole($user);
        if ($rol === 'cliente') {
            return $antecedente->historial->id_usuario === $user->id;
        }
        return in_array($rol, ['instructor', 'administrador', 'recepcionista'], true);
    }

    public function create(Usuario $user): bool
    {
        return $this->getRole($user) === 'cliente';
    }

    public function update(Usuario $user, Antecedente $antecedente): bool
    {
        $rol = $this->getRole($user);
        return $rol === 'cliente' && $antecedente->historial->id_usuario === $user->id;
    }

    public function delete(Usuario $user, Antecedente $antecedente): bool
    {
        $rol = $this->getRole($user);
        return $rol === 'cliente' && $antecedente->historial->id_usuario === $user->id;
    }
}
