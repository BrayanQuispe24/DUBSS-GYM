<?php

namespace App\Actions\Nutricion;

use App\Models\PlanAlimentacion;
use Illuminate\Database\Eloquent\Collection;

class ListarPlanesAlimentacionAction
{
    public function execute(): Collection
    {
        return PlanAlimentacion::with(['usuario', 'detalles'])
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
