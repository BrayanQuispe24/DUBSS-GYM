<?php

namespace App\DTOs\PlanTarifa;

use App\Http\Requests\PlanTarifa\UpdateTarifaRequest;

readonly class UpdateTarifaDTO
{
    public function __construct(
        public int $id,
        public ?string $nombre = null,
        public ?float $precio = null,
        public ?string $fechaInicio = null,
        public ?string $fechaFin = null,
        public ?bool $estado = null,
    ) {}

    public static function fromRequest(UpdateTarifaRequest $request): self
    {
        return new self(
            id: (int) $request->validated('id'),
            nombre: $request->validated('nombre'),
            precio: $request->validated('precio') !== null ? (float) $request->validated('precio') : null,
            fechaInicio: $request->validated('fecha_inicio'),
            fechaFin: $request->validated('fecha_fin'),
            estado: $request->validated('estado'),
        );
    }
}
