<?php

namespace App\Actions\PlanTarifa;

use App\Models\Plan;
use Illuminate\Database\Eloquent\Collection;

class ListarPlanesAction
{
    public function execute(): Collection
    {
        return Plan::with('tarifa')->orderBy('created_at', 'desc')->get();
    }
}
