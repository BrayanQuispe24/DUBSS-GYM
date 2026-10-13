<?php

namespace App\DTOs\Usuario;

use App\Http\Requests\Usuario\UpdateUsuarioRequest;

readonly class UpdateUsuarioDTO
{
    public function __construct(
        public int $id,
        public string $nombre,
        public string $apellido,
        public string $email,
        public ?string $password,
        public string $rol,
        public ?string $codigo = null,
        public ?string $celular = null,
        public ?string $ci = null,
        public ?string $tipo_usuario = null,
        public ?bool $estado = null,
        public ?int $id_disciplina = null
    ) {}

    public static function fromRequest(UpdateUsuarioRequest $request): self
    {
        $estadoInput = $request->validated('estado');
        $estadoBool = null;
        if ($estadoInput !== null) {
            $estadoBool = in_array($estadoInput, [true, 1, '1', 'activo'], true);
        }

        $idDisc = $request->validated('id_disciplina');

        return new self(
            id: (int) $request->validated('id'),
            nombre: $request->validated('nombre'),
            apellido: $request->validated('apellido'),
            email: $request->validated('email'),
            password: $request->validated('password'),
            rol: ucfirst(strtolower($request->validated('rol'))),
            codigo: $request->validated('codigo'),
            celular: $request->validated('celular'),
            ci: $request->validated('ci'),
            tipo_usuario: $request->validated('tipo_usuario'),
            estado: $estadoBool,
            id_disciplina: $idDisc !== null ? (int) $idDisc : null
        );
    }
}
