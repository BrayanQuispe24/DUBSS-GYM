<?php

namespace App\DTOs\Nutricion;

use App\Http\Requests\Nutricion\CreatePlanAlimentacionRequest;

readonly class CreatePlanAlimentacionDTO
{
    public function __construct(
        public string $nombre,
        public int $idUsuario,
        public ?string $objetivo = null,
        public ?string $fechaInicio = null,
        public ?string $fechaFin = null,
        public ?string $observacion = null,
        public bool $estado = true,
        public array $detalles = [],
    ) {}

    public static function fromRequest(CreatePlanAlimentacionRequest $request): self
    {
        return new self(
            nombre: $request->validated('nombre'),
            idUsuario: (int) $request->validated('id_usuario'),
            objetivo: $request->validated('objetivo'),
            fechaInicio: $request->validated('fecha_inicio'),
            fechaFin: $request->validated('fecha_fin'),
            observacion: $request->validated('observacion'),
            estado: $request->validated('estado', true),
            detalles: $request->validated('detalles', []),
        );
    }
}
