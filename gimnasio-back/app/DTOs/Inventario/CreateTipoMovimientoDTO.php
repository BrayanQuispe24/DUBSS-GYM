<?php

namespace App\DTOs\Inventario;

use App\Http\Requests\Inventario\CreateTipoMovimientoRequest;

readonly class CreateTipoMovimientoDTO
{
    public function __construct(
        public string $nombre,
        public ?string $descripcion = null,
        public bool $es_salida = false,
    ) {}

    public static function fromRequest(CreateTipoMovimientoRequest $request): self
    {
        return new self(
            nombre: $request->validated('nombre'),
            descripcion: $request->validated('descripcion'),
            es_salida: filter_var($request->validated('es_salida', false), FILTER_VALIDATE_BOOLEAN),
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'nombre' => $this->nombre,
            'descripcion' => $this->descripcion,
            'es_salida' => $this->es_salida,
        ], fn ($val) => $val !== null);
    }
}
