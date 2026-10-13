<?php

namespace App\Actions\Espacio;

use App\Models\Ambiente;
use Illuminate\Database\Eloquent\Collection;

class ListarAmbientesAction
{
    public function execute(): Collection
    {
        return Ambiente::where('estado', true)->get();
    }
}
