<?php

namespace App\DTOs\Entrenamiento;

use App\Http\Requests\Entrenamiento\CreateEjercicioRequest;

readonly class CreateEjercicioDTO
{
    public function __construct(
        public string $nombre,
        public ?string $descripcion = null,
        public ?string $urlVideo = null,
        public ?int $idTipoEjercicio = null,
    ) {}

    public static function fromRequest(CreateEjercicioRequest $request): self
    {
        return new self(
            nombre: $request->validated('nombre'),
            descripcion: $request->validated('descripcion'),
            urlVideo: $request->validated('url_video'),
            idTipoEjercicio: $request->validated('id_tipo_ejercicio') ? (int) $request->validated('id_tipo_ejercicio') : null,
        );
    }
}
