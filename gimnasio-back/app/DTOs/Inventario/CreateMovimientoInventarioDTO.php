<?php

namespace App\DTOs\Inventario;

use App\Http\Requests\Inventario\CreateMovimientoInventarioRequest;

readonly class CreateMovimientoInventarioDTO
{
    public function __construct(
        public int $id_equipo,
        public int $id_tipo_movimiento,
        public int $cantidad,
        public string $motivo,
        public ?string $observacion = null
    ) {}

    public static function fromRequest(CreateMovimientoInventarioRequest $request): self
    {
        return new self(
            id_equipo: (int) $request->validated('id_equipo'),
            id_tipo_movimiento: (int) $request->validated('id_tipo_movimiento'),
            cantidad: (int) $request->validated('cantidad'),
            motivo: $request->validated('motivo'),
            observacion: $request->validated('observacion')
        );
    }
}
