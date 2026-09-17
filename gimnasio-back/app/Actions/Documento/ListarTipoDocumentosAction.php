<?php

namespace App\Actions\Documento;

use App\Models\TipoDocumento;
use Illuminate\Database\Eloquent\Collection;

class ListarTipoDocumentosAction
{
    public function execute(): Collection
    {
        return TipoDocumento::all();
    }
}
