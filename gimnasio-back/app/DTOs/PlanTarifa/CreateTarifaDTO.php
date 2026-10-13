<?php

namespace App\DTOs\PlanTarifa;

use App\Http\Requests\PlanTarifa\CreateTarifaRequest;

readonly class CreateTarifaDTO
{
    public function __construct(
        public string $nombre,
        public float $precio,
        public ?string $fechaInicio = null,
        public ?string $fechaFin = null,
        public bool $estado = true,
    ) {}

    public static function fromRequest(CreateTarifaRequest $request): self
    {
        return new self(
            nombre: $request->validated('nombre'),
            precio: (float) $request->validated('precio'),
            fechaInicio: $request->validated('fecha_inicio'),
            fechaFin: $request->validated('fecha_fin'),
            estado: $request->validated('estado', true),
        );
    }
}
