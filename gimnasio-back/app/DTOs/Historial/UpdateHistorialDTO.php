<?php

namespace App\DTOs\Historial;

use App\Http\Requests\Historial\UpdateHistorialRequest;

readonly class UpdateHistorialDTO
{
    public function __construct(
        public int $id,
        public ?string $fecha_apertura = null,
        public ?string $observaciones_generales = null,
        public ?string $grupo_sanguineo = null,
        public ?string $sexo = null,
        public ?string $fecha_nacimiento = null,
        public ?string $domicilio = null,
        public ?string $facultad_carrera = null,
        public ?string $celular_emergencia = null
    ) {}

    public static function fromRequest(UpdateHistorialRequest $request): self
    {
        return new self(
            id: (int) ($request->route('id') ?? $request->validated('id')),
            fecha_apertura: $request->validated('fecha_apertura'),
            observaciones_generales: $request->validated('observaciones_generales'),
            grupo_sanguineo: $request->validated('grupo_sanguineo'),
            sexo: $request->validated('sexo'),
            fecha_nacimiento: $request->validated('fecha_nacimiento'),
            domicilio: $request->validated('domicilio'),
            facultad_carrera: $request->validated('facultad_carrera'),
            celular_emergencia: $request->validated('celular_emergencia')
        );
    }
}
