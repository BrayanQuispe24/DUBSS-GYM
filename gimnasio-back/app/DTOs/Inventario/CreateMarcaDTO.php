<?php

namespace App\DTOs\Inventario;

use App\Http\Requests\Inventario\CreateMarcaRequest;

readonly class CreateMarcaDTO
{
    public function __construct(
        public string $nombre,
        public bool $estado = true,
    ) {}

    public static function fromRequest(CreateMarcaRequest $request): self
    {
        $rawEstado = $request->validated('estado');
        $estadoBool = true;

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
