<?php

namespace App\DTOs\Inventario;

use App\Http\Requests\Inventario\UpdateTipoMovimientoRequest;

readonly class UpdateTipoMovimientoDTO
{
    public function __construct(
        public ?string $nombre = null,
        public ?string $descripcion = null,
        public ?bool $es_salida = null,
    ) {}

    public static function fromRequest(UpdateTipoMovimientoRequest $request): self
    {
        $rawEsSalida = $request->validated('es_salida');

        return new self(
            nombre: $request->validated('nombre'),
            descripcion: $request->validated('descripcion'),
            es_salida: $rawEsSalida !== null ? filter_var($rawEsSalida, FILTER_VALIDATE_BOOLEAN) : null,
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
