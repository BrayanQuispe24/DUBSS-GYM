<?php

namespace App\Policies;

use App\Models\Documento;
use App\Models\Usuario;

class DocumentoPolicy
{
    private function getRole(Usuario $user): string
    {
        return mb_strtolower($user->rol->nombre ?? '');
    }

    public function viewAny(Usuario $user): bool
    {
        $rol = $this->getRole($user);
        return in_array($rol, ['cliente', 'administrador'], true);
    }

    public function view(Usuario $user, Documento $documento): bool
    {
        $rol = $this->getRole($user);
        if ($rol === 'cliente') {
            return $documento->id_usuario === $user->id;
        }
        return $rol === 'administrador';
    }

    public function create(Usuario $user): bool
    {
        $rol = $this->getRole($user);
        return in_array($rol, ['cliente', 'administrador'], true);
    }

    public function update(Usuario $user, Documento $documento): bool
    {
        $rol = $this->getRole($user);
        if ($rol === 'cliente') {
            return $documento->id_usuario === $user->id;
        }
        return $rol === 'administrador';
    }

    public function delete(Usuario $user, Documento $documento): bool
    {
        $rol = $this->getRole($user);
        if ($rol === 'cliente') {
            return $documento->id_usuario === $user->id;
        }
        return $rol === 'administrador';
    }
}
