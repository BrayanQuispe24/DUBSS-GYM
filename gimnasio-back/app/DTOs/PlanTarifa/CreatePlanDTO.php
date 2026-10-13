<?php

namespace App\DTOs\PlanTarifa;

use App\Http\Requests\PlanTarifa\CreatePlanRequest;

readonly class CreatePlanDTO
{
    public function __construct(
        public string $nombre,
        public ?string $descripcion,
        public int $duracionDias,
        public bool $estado = true,
        public ?int $idTarifa = null,
    ) {}

    public static function fromRequest(CreatePlanRequest $request): self
    {
        return new self(
            nombre: $request->validated('nombre'),
            descripcion: $request->validated('descripcion'),
            duracionDias: (int) $request->validated('duracion_dias'),
            estado: $request->validated('estado', true),
            idTarifa: $request->validated('id_tarifa') ? (int) $request->validated('id_tarifa') : null,
        );
    }
}
