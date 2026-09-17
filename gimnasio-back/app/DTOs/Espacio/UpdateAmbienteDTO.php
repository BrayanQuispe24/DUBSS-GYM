<?php

namespace App\DTOs\Espacio;

use App\Http\Requests\Espacio\UpdateAmbienteRequest;

readonly class UpdateAmbienteDTO
{
    public function __construct(
        public ?string $nombre = null,
        public ?string $descripcion = null,
        public ?bool $estado = null,
    ) {}

    public static function fromRequest(UpdateAmbienteRequest $request): self
    {
        $rawEstado = $request->validated('estado');
        $estadoBool = null;

        if ($rawEstado !== null) {
            if (is_bool($rawEstado)) {
                $estadoBool = $rawEstado;
            } elseif (is_numeric($rawEstado)) {
                $estadoBool = (bool) $rawEstado;
            } elseif (is_string($rawEstado)) {
                $estadoBool = in_array(strtolower($rawEstado), ['disponible', 'activo', 'true', '1']);
            }
        }

        return new self(
            nombre: $request->validated('nombre'),
            descripcion: $request->validated('descripcion'),
            estado: $estadoBool,
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'nombre' => $this->nombre,
            'descripcion' => $this->descripcion,
            'estado' => $this->estado,
        ], fn ($val) => $val !== null);
    }
}
