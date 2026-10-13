<?php

namespace App\Actions\PlanTarifa;

use App\Models\Tarifa;

class DeleteTarifaAction
{
    public function execute(int $id): bool
    {
        $tarifa = Tarifa::findOrFail($id);

        return (bool) $tarifa->delete();
    }
}
