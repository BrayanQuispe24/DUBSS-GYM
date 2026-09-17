<?php

namespace App\DTOs\Seguridad;

use App\Http\Requests\Seguridad\UpdatePermisoRequest;

readonly class UpdatePermisoDTO
{
    public function __construct(
        public int $id,
        public string $nombre,
        public ?bool $estado = null
    ) {}

    public static function fromRequest(UpdatePermisoRequest $request): self
    {
        return new self(
            id: (int) ($request->route('id') ?? $request->validated('id')),
            nombre: $request->validated('nombre'),
            estado: $request->validated('estado')
        );
    }
}
