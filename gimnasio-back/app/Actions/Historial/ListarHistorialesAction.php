<?php

namespace App\Actions\Historial;

use App\Models\Historial;
use App\Models\Usuario;
use Illuminate\Database\Eloquent\Collection;

class ListarHistorialesAction
{
    public function execute(Usuario $user): Collection
    {
        $rol = mb_strtolower($user->rol->nombre ?? '');
        if ($rol === 'cliente') {
            return Historial::where('id_usuario', $user->id)->with(['usuario', 'detalles', 'antecedentes'])->get();
        }

        return Historial::with(['usuario', 'detalles', 'antecedentes'])->get();
    }
}
