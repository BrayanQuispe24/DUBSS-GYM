<?php

namespace App\Actions\Tramite;

use App\Models\BoletaPago;
use App\Models\Usuario;
use Illuminate\Database\Eloquent\Collection;

class ListarBoletasPagoAction
{
    public function execute(?Usuario $user = null): Collection
    {
        $query = BoletaPago::with('formularioSolicitud.usuario');

        if ($user) {
            $user->loadMissing('rol');
            $rolNombre = mb_strtolower($user->rol ? $user->rol->nombre : ($user->tipo_usuario ?? 'cliente'));

            if (! in_array($rolNombre, ['administrador', 'recepcionista'], true)) {
                $query->whereHas('formularioSolicitud', function ($q) use ($user) {
                    $q->where('id_usuario', $user->id);
                });
            }
        }

        return $query->orderBy('created_at', 'desc')->get();
    }
}
