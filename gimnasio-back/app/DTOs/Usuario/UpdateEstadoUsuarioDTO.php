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
        $estadoBool = in_array($estadoInput, [true, 1, '1', 'activo'], true);

        return new self(
            id: (int) $request->validated('id'),
            estado: $estadoBool,
        );
    }
}
