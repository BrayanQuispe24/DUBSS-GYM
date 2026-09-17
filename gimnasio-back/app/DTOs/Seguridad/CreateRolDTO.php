<?php

namespace App\DTOs\Seguridad;

use App\Http\Requests\Seguridad\CreateRolRequest;

readonly class CreateRolDTO
{
    public function __construct(
        public string $nombre,
        public bool $estado = true
    ) {}

    public static function fromRequest(CreateRolRequest $request): self
    {
        return new self(
            nombre: $request->validated('nombre'),
            estado: $request->validated('estado') ?? true
        );
    }
}
