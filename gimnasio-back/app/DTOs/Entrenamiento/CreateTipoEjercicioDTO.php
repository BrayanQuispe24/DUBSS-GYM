<?php

namespace App\DTOs\Entrenamiento;

use App\Http\Requests\Entrenamiento\CreateTipoEjercicioRequest;

readonly class CreateTipoEjercicioDTO
{
    public function __construct(
        public string $nombre,
        public ?string $descripcion = null,
    ) {}

    public static function fromRequest(CreateTipoEjercicioRequest $request): self
    {
        return new self(
            nombre: $request->validated('nombre'),
            descripcion: $request->validated('descripcion'),
        );
    }
}
