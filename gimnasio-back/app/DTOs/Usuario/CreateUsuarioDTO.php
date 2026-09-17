<?php

namespace App\DTOs\Usuario;

use App\Http\Requests\Usuario\CreateUserRequest;

readonly class CreateUsuarioDTO
{
    public function __construct(
        public string $nombre,
        public string $apellido,
        public string $email,
        public string $password,
        public string $rol,
        public ?string $codigo = null,
        public ?string $celular = null,
        public ?string $ci = null,
        public ?string $tipo_usuario = 'estudiante',
        public ?bool $estado = true
    ) {}

    public static function fromRequest(CreateUserRequest $request): self
    {
        $estadoInput = $request->validated('estado');
        $estadoBool = true;
        if ($estadoInput !== null) {
            $estadoBool = in_array($estadoInput, [true, 1, '1', 'activo'], true);
        }

        return new self(
            nombre: $request->validated('nombre'),
            apellido: $request->validated('apellido'),
            email: $request->validated('email'),
            password: $request->validated('password'),
            rol: ucfirst(strtolower($request->validated('rol'))),
            codigo: $request->validated('codigo'),
            celular: $request->validated('celular'),
            ci: $request->validated('ci'),
            tipo_usuario: $request->validated('tipo_usuario') ?? 'estudiante',
            estado: $estadoBool
        );
    }
}
