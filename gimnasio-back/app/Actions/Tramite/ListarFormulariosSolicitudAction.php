<?php

namespace App\Actions\Tramite;

use App\Models\FormularioSolicitud;
use App\Models\Usuario;
use Illuminate\Database\Eloquent\Collection;

class ListarFormulariosSolicitudAction
{
    public function execute(?Usuario $user = null): Collection
    {
        $query = FormularioSolicitud::with(['disciplina', 'disciplinaHorario.horario', 'plan.tarifa', 'usuario.documentos.tipoDocumento', 'boletasPago']);

        if ($user) {
            $user->loadMissing('rol');
            $rolNombre = mb_strtolower($user->rol ? $user->rol->nombre : ($user->tipo_usuario ?? 'cliente'));

            if (! in_array($rolNombre, ['administrador', 'recepcionista'], true)) {
                $query->where('id_usuario', $user->id);
            }
        }

        return $query->orderBy('created_at', 'desc')->get();
    }
}
