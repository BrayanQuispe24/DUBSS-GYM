<?php

namespace App\DTOs\Seguridad;

use App\Http\Requests\Seguridad\AsignarRolPermisoRequest;

readonly class AsignarRolPermisoDTO
{
    /**
     * @param int $id_rol
     * @param array<int> $permisos
     */
    public function __construct(
        public int $id_rol,
        public array $permisos
    ) {}

    public static function fromRequest(AsignarRolPermisoRequest $request): self
    {
        return new self(
            id_rol: (int) $request->validated('id_rol'),
            permisos: array_map('intval', $request->validated('permisos'))
        );
    }
}
