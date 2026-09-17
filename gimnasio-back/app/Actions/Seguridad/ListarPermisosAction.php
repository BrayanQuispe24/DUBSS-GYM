<?php

namespace App\Actions\Seguridad;

use App\Models\Permiso;
use Illuminate\Database\Eloquent\Collection;

class ListarPermisosAction
{
    public function execute(): Collection
    {
        return Permiso::all();
    }
}
