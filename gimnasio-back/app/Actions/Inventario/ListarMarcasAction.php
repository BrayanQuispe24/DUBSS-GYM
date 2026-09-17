<?php

namespace App\Actions\Inventario;

use App\Models\Marca;
use Illuminate\Database\Eloquent\Collection;

class ListarMarcasAction
{
    public function execute(): Collection
    {
        return Marca::all();
    }
}
