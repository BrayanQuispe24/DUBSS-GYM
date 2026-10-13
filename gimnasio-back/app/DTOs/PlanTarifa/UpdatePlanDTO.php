<?php

namespace App\DTOs\PlanTarifa;

use App\Http\Requests\PlanTarifa\UpdatePlanRequest;

readonly class UpdatePlanDTO
{
    public function __construct(
        public int $id,
        public ?string $nombre = null,
        public ?string $descripcion = null,
        public ?int $duracionDias = null,
        public ?bool $estado = null,
        public ?int $idTarifa = null,
    ) {}

    public static function fromRequest(UpdatePlanRequest $request): self
    {
        return new self(
            id: (int) $request->validated('id'),
            nombre: $request->validated('nombre'),
            descripcion: $request->validated('descripcion'),
            duracionDias: $request->validated('duracion_dias') !== null ? (int) $request->validated('duracion_dias') : null,
            estado: $request->validated('estado'),
            idTarifa: $request->validated('id_tarifa') !== null ? (int) $request->validated('id_tarifa') : null,
        );
    }
}
