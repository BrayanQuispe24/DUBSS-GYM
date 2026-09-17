<?php

namespace App\Actions\Inventario;

use App\Models\Marca;

class DeleteMarcaAction
{
    public function execute(Marca $marca): bool
    {
        return (bool) $marca->delete();
    }
}
