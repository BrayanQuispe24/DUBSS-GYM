<?php

namespace App\DTOs\Historial;

use App\Http\Requests\Historial\CreateDetalleHistorialRequest;

readonly class CreateDetalleHistorialDTO
{
    public function __construct(
        public int $id_historial,
        public ?float $peso = null,
        public ?float $altura = null,
        public ?float $imc = null,
        public ?float $porcentaje_grasa = null,
        public ?float $masa_muscular = null,
        public ?string $presion = null,
        public ?string $fecha_registro = null
    ) {}

    public static function fromRequest(CreateDetalleHistorialRequest $request): self
    {
        return new self(
            id_historial: (int) $request->validated('id_historial'),
            peso: $request->validated('peso') !== null ? (float) $request->validated('peso') : null,
            altura: $request->validated('altura') !== null ? (float) $request->validated('altura') : null,
            imc: $request->validated('imc') !== null ? (float) $request->validated('imc') : null,
            porcentaje_grasa: $request->validated('porcentaje_grasa') !== null ? (float) $request->validated('porcentaje_grasa') : null,
            masa_muscular: $request->validated('masa_muscular') !== null ? (float) $request->validated('masa_muscular') : null,
            presion: $request->validated('presion'),
            fecha_registro: $request->validated('fecha_registro') ?? now()->toDateTimeString()
        );
    }
}
