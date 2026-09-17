<?php

namespace App\Actions\Documento;

use App\DTOs\Documento\CreateTipoDocumentoDTO;
use App\Models\TipoDocumento;

class CreateTipoDocumentoAction
{
    public function execute(CreateTipoDocumentoDTO $dto): TipoDocumento
    {
        return TipoDocumento::create([
            'nombre' => $dto->nombre,
            'descripcion' => $dto->descripcion,
        ]);
    }
}
