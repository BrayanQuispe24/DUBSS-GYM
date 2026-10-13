<?php

namespace App\DTOs\Usuario;

use App\Http\Requests\Usuario\UpdateEstadoUsuarioRequest;

readonly class UpdateEstadoUsuarioDTO
{
    public function __construct(
        public int $id,
        public bool $estado,
    ) {}

    public static function fromRequest(UpdateEstadoUsuarioRequest $request): self
    {
        $estadoInput = $request->validated('estado');

        if (is_bool($estadoInput)) {
            $estadoBool = $estadoInput;
        } elseif (is_numeric($estadoInput)) {
            $estadoBool = ((int) $estadoInput) === 1;
        } else {
            $normalized = strtolower(trim((string) $estadoInput));
            $estadoBool = in_array($normalized, ['activo', '1', 'true'], true);
        }

        return new self(
            id: (int) $request->validated('id'),
            estado: $estadoBool,
        );
    }
}
