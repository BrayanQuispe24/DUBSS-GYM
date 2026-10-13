<?php

namespace App\DTOs\Entrenamiento;

use App\Http\Requests\Entrenamiento\CreateGrupoMuscularRequest;

readonly class CreateGrupoMuscularDTO
{
    public function __construct(
        public string $nombre,
        public ?string $descripcion = null,
    ) {}

    public static function fromRequest(CreateGrupoMuscularRequest $request): self
    {
        return new self(
            nombre: $request->validated('nombre'),
            descripcion: $request->validated('descripcion'),
        );
    }
}
