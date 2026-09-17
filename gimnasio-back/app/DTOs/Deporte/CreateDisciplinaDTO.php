<?php

namespace App\DTOs\Deporte;

use App\Http\Requests\Deporte\CreateDisciplinaRequest;

readonly class CreateDisciplinaDTO
{
    public function __construct(
        public string $nombre,
        public int $cantidad_cupos,
        public ?string $estado = 'activo'
    ) {}

    public static function fromRequest(CreateDisciplinaRequest $request): self
    {
        return new self(
            nombre: $request->validated('nombre'),
            cantidad_cupos: (int) $request->validated('cantidad_cupos'),
            estado: $request->validated('estado') ?? 'activo'
        );
    }
}
