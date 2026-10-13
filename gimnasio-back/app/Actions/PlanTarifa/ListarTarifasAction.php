<?php

namespace App\Actions\PlanTarifa;

use App\Models\Tarifa;
use Illuminate\Database\Eloquent\Collection;

class ListarTarifasAction
{
    public function execute(): Collection
    {
        return Tarifa::orderBy('created_at', 'desc')->get();
    }
}
