<?php

namespace App\Actions\Deporte;

use App\Models\Horario;
use Illuminate\Database\Eloquent\Collection;

class ListarHorariosAction
{
    public function execute(): Collection
    {
        return Horario::all();
    }
}
