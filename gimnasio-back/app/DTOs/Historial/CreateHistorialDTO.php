<?php

namespace App\DTOs\Historial;

use App\Http\Requests\Historial\CreateHistorialRequest;

readonly class CreateHistorialDTO
{
    public function __construct(
        public ?string $fecha_apertura = null,
        public ?string $observaciones_generales = null,
        public ?string $grupo_sanguineo = null,
        public ?string $sexo = null,
        public ?string $fecha_nacimiento = null,
        public ?string $domicilio = null,
        public ?string $celular_emergencia = null
    ) {}

    public static function fromRequest(CreateHistorialRequest $request): self
    {
        return new self(
            fecha_apertura: $request->validated('fecha_apertura') ?? now()->toDateTimeString(),
            observaciones_generales: $request->validated('observaciones_generales') ?? $request->validated('observaciones') ?? $request->input('observaciones'),
            grupo_sanguineo: $request->validated('grupo_sanguineo'),
            sexo: $request->validated('sexo'),
            fecha_nacimiento: $request->validated('fecha_nacimiento'),
            domicilio: $request->validated('domicilio'),
            celular_emergencia: $request->validated('celular_emergencia')
        );
    }
}
