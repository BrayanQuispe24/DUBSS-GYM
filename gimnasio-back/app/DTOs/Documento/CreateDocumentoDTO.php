<?php

namespace App\DTOs\Documento;

use App\Http\Requests\Documento\CreateDocumentoRequest;
use Illuminate\Http\UploadedFile;

readonly class CreateDocumentoDTO
{
    public function __construct(
        public int $id_tipo_documento,
        public UploadedFile $archivo
    ) {}

    public static function fromRequest(CreateDocumentoRequest $request): self
    {
        return new self(
            id_tipo_documento: (int) $request->validated('id_tipo_documento'),
            archivo: $request->file('archivo')
        );
    }
}
