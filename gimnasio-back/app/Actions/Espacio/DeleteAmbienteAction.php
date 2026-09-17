<?php

namespace App\Actions\Espacio;

use App\Models\Ambiente;

class DeleteAmbienteAction
{
    public function execute(Ambiente $ambiente): bool
    {
        return (bool) $ambiente->delete();
    }
}
