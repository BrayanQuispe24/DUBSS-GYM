<?php

namespace App\DTOs\Entrenamiento;

use App\Http\Requests\Entrenamiento\CreatePlanEntrenamientoRequest;

readonly class CreatePlanEntrenamientoDTO
{
    public function __construct(
        public string $nombre,
        public int $idUsuario,
        public ?string $objetivo = null,
        public ?string $fechaInicio = null,
        public ?string $fechaFin = null,
        public bool $estado = true,
        public ?string $observacion = null,
        public array $rutinas = [],
    ) {}

    public static function fromRequest(CreatePlanEntrenamientoRequest $request): self
    {
        return new self(
            nombre: $request->validated('nombre'),
            idUsuario: (int) $request->validated('id_usuario'),
            objetivo: $request->validated('objetivo'),
            fechaInicio: $request->validated('fecha_inicio'),
            fechaFin: $request->validated('fecha_fin'),
            estado: $request->validated('estado', true),
            observacion: $request->validated('observacion'),
            rutinas: $request->validated('rutinas', []),
        );
    }
}
