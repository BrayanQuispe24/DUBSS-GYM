<?php

namespace App\DTOs\Auth;

use App\Http\Requests\Auth\AuthRegisterRequest;

readonly class RegisterUserDTO
{
    public function __construct(
        public string $nombre,
        public string $apellido,
        public string $email,
        public string $password,
        public string $rol,
        public ?string $codigo = null,
        public ?string $ci = null,
        public ?string $celular = null,
        public ?string $tipo_usuario = null,
    ) {}

    public static function fromRequest(AuthRegisterRequest $request): self
    {
        return new self(
            nombre: $request->validated('nombre'),
            apellido: $request->validated('apellido'),
            email: $request->validated('email'),
            password: $request->validated('password'),
            rol: $request->validated('rol'),
            codigo: $request->validated('codigo'),
            ci: $request->validated('ci'),
            celular: $request->validated('celular'),
            tipo_usuario: $request->validated('tipo_usuario'),
        );
    }
}
