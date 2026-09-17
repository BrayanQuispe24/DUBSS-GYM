<?php

namespace App\DTOs\Inventario;

use App\Http\Requests\Inventario\UpdateMarcaRequest;

readonly class UpdateMarcaDTO
{
    public function __construct(
        public ?string $nombre = null,
        public ?bool $estado = null,
    ) {}

    public static function fromRequest(UpdateMarcaRequest $request): self
    {
        $rawEstado = $request->validated('estado');
        $estadoBool = null;

        if ($rawEstado !== null) {
            if (is_bool($rawEstado)) {
                $estadoBool = $rawEstado;
            } elseif (is_numeric($rawEstado)) {
                $estadoBool = (bool) $rawEstado;
            } elseif (is_string($rawEstado)) {
                $estadoBool = in_array(strtolower($rawEstado), ['activo', 'disponible', 'true', '1']);
            }
        }

        return new self(
            nombre: $request->validated('nombre'),
            estado: $estadoBool,
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'nombre' => $this->nombre,
            'estado' => $this->estado,
        ], fn ($val) => $val !== null);
    }
}
