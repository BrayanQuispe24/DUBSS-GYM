<?php

namespace App\Actions\Documento;

use App\DTOs\Documento\UpdateTipoDocumentoDTO;
use App\Models\TipoDocumento;

class UpdateTipoDocumentoAction
{
    public function execute(UpdateTipoDocumentoDTO $dto): TipoDocumento
    {
        $tipo = TipoDocumento::findOrFail($dto->id);
        $tipo->update(array_filter([
            'nombre' => $dto->nombre,
            'descripcion' => $dto->descripcion,
        ], fn ($val) => $val !== null));

        return $tipo;
    }
}
