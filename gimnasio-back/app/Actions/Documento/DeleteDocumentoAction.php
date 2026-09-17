<?php

namespace App\Actions\Documento;

use App\Models\Documento;

class DeleteDocumentoAction
{
    public function execute(int $id): bool
    {
        $documento = Documento::findOrFail($id);
        return (bool) $documento->delete();
    }
}
