<?php

namespace App\DTOs\Seguridad;

use App\Http\Requests\Seguridad\CreatePermisoRequest;

readonly class CreatePermisoDTO
{
    public function __construct(
        public string $nombre,
        public bool $estado = true
    ) {}

    public static function fromRequest(CreatePermisoRequest $request): self
    {
        return new self(
            nombre: $request->validated('nombre'),
            estado: $request->validated('estado') ?? true
        );
    }
}
