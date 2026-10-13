<?php

namespace App\DTOs\Entrenamiento;

use App\Http\Requests\Entrenamiento\CreateRutinaRequest;

readonly class CreateRutinaDTO
{
    public function __construct(
        public string $nombre,
        public ?string $descripcion = null,
        public ?string $nivel = null,
        public bool $estado = true,
        public array $ejercicios = [],
    ) {}

    public static function fromRequest(CreateRutinaRequest $request): self
    {
        return new self(
            nombre: $request->validated('nombre'),
            descripcion: $request->validated('descripcion'),
            nivel: $request->validated('nivel'),
            estado: $request->validated('estado', true),
            ejercicios: $request->validated('ejercicios', []),
        );
    }
}
