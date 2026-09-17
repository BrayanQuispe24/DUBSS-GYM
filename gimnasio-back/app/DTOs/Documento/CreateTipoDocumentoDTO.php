<?php

namespace App\DTOs\Documento;

use App\Http\Requests\Documento\CreateTipoDocumentoRequest;

readonly class CreateTipoDocumentoDTO
{
    public function __construct(
        public string $nombre,
        public ?string $descripcion = null
    ) {}

    public static function fromRequest(CreateTipoDocumentoRequest $request): self
    {
        return new self(
            nombre: $request->validated('nombre'),
            descripcion: $request->validated('descripcion')
        );
    }
}
