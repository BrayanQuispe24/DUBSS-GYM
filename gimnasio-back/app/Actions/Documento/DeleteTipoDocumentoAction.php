<?php

namespace App\Actions\Documento;

use App\Models\TipoDocumento;

class DeleteTipoDocumentoAction
{
    public function execute(int $id): bool
    {
        $tipo = TipoDocumento::findOrFail($id);
        return (bool) $tipo->delete();
    }
}
