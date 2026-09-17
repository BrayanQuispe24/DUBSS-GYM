<?php

namespace App\Actions\Historial;

use App\Models\Historial;

class DeleteHistorialAction
{
    public function execute(int $id): bool
    {
        $historial = Historial::findOrFail($id);
        return (bool) $historial->delete();
    }
}
