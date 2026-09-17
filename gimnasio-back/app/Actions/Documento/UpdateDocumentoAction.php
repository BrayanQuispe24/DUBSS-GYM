<?php

namespace App\Actions\Documento;

use App\DTOs\Documento\UpdateDocumentoDTO;
use App\Models\Documento;
use Illuminate\Support\Facades\Storage;

class UpdateDocumentoAction
{
    public function execute(UpdateDocumentoDTO $dto): Documento
    {
        $documento = Documento::findOrFail($dto->id);
        
        if ($dto->archivo) {
            $path = $dto->archivo->store('documentos', 'public');
            $documento->archivo_url = Storage::url($path);
        }

        if ($dto->id_tipo_documento) {
            $documento->id_tipo_documento = $dto->id_tipo_documento;
        }

        $documento->save();
        return $documento;
    }
}
