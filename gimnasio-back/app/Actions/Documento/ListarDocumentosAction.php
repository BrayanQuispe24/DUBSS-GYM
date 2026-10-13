<?php

namespace App\Actions\Documento;

use App\Models\Documento;
use App\Models\Usuario;
use Illuminate\Database\Eloquent\Collection;

class ListarDocumentosAction
{
    public function execute(Usuario $user): Collection
    {
        $user->loadMissing('rol');
        $rolNombre = mb_strtolower($user->rol ? $user->rol->nombre : ($user->tipo_usuario ?? 'cliente'));

        $isAdminOrStaff = in_array($rolNombre, ['administrador', 'recepcionista'], true);

        if (! $isAdminOrStaff) {
            return Documento::where('id_usuario', $user->id)
                ->with(['usuario', 'tipoDocumento'])
                ->get();
        }

        return Documento::with(['usuario', 'tipoDocumento'])->get();
    }
}
