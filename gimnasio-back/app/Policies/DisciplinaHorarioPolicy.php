<?php

namespace App\Policies;

use App\Models\Usuario;

class DisciplinaHorarioPolicy
{
    private function isAdmin(Usuario $user): bool
    {
        return $user->esAdmin();
    }

    public function viewAny(Usuario $user): bool
    {
        return true;
    }

    public function view(Usuario $user): bool
    {
        return true;
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
