<?php

namespace App\Actions\Documento;

use App\Models\Documento;
use App\Models\Usuario;
use Illuminate\Database\Eloquent\Collection;

class ListarDocumentosAction
{
    public function execute(Usuario $user): Collection
    {
        $rol = mb_strtolower($user->rol->nombre ?? '');
        if ($rol === 'cliente') {
            return Documento::where('id_usuario', $user->id)->with(['usuario', 'tipoDocumento'])->get();
        }

        return Documento::with(['usuario', 'tipoDocumento'])->get();
    }
}
