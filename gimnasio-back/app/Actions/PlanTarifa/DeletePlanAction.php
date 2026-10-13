<?php

namespace App\Actions\PlanTarifa;

use App\Models\Plan;

class DeletePlanAction
{
    public function execute(int $id): bool
    {
        $plan = Plan::findOrFail($id);

        return (bool) $plan->delete();
    }
}
