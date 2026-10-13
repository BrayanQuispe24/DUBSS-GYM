<?php

namespace App\Actions\Acceso;

use App\Models\RegistroEntradaSalida;
use Illuminate\Database\Eloquent\Collection;

class ListarRegistrosEntradaSalidaAction
{
    public function execute(): Collection
    {
        return RegistroEntradaSalida::with(['usuario', 'boletaInscripcion'])
            ->orderBy('fecha_hora', 'desc')
            ->get();
    }
}
