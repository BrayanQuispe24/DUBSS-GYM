<?php

namespace App\Policies;

use App\Models\Antecedente;
use App\Models\Usuario;

class AntecedentePolicy
{
    public function viewAny(Usuario $user): bool
    {
        return true;
    }

    public function view(Usuario $user, Antecedente $antecedente): bool
    {
        return true;
    }

    public function create(Usuario $user): bool
    {
        return true;
    }

    public function update(Usuario $user, Antecedente $antecedente): bool
    {
        return true;
    }

    public function delete(Usuario $user, Antecedente $antecedente): bool
    {
        return mb_strtolower($user->rol?->nombre ?? '') === 'administrador';
    }
}
