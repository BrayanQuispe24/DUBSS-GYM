<?php

namespace App\DTOs\Documento;

use App\Http\Requests\Documento\UpdateTipoDocumentoRequest;

readonly class UpdateTipoDocumentoDTO
{
    public function __construct(
        public int $id,
        public string $nombre,
        public ?string $descripcion = null
    ) {}

    public static function fromRequest(UpdateTipoDocumentoRequest $request): self
    {
        return new self(
            id: (int) ($request->route('id') ?? $request->validated('id')),
            nombre: $request->validated('nombre'),
            descripcion: $request->validated('descripcion')
        );
    }
}
