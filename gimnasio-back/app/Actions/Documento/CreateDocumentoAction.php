<?php

namespace App\Actions\Documento;

use App\DTOs\Documento\CreateDocumentoDTO;
use App\Models\Documento;
use App\Models\Usuario;
use Illuminate\Support\Facades\Storage;

class CreateDocumentoAction
{
    public function execute(CreateDocumentoDTO $dto, Usuario $usuario): Documento
    {
        $path = $dto->archivo->store('documentos', 'public');
        $url = Storage::url($path);

        $targetUserId = $usuario->id;

        $doc = Documento::create([
            'id_usuario' => $targetUserId,
            'id_tipo_documento' => $dto->id_tipo_documento,
            'archivo_url' => $url,
        ]);

        return $doc->load(['usuario', 'tipoDocumento']);
    }
}
