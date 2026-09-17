<?php

namespace App\Actions\Usuario;

use App\DTOs\Usuario\UpdateEstadoUsuarioDTO;
use App\Models\Usuario;

class UpdateEstadoUsuario
{
    public function execute(UpdateEstadoUsuarioDTO $dto): Usuario
    {
        $usuario = Usuario::find($dto->id);
        if (!$usuario) {
            throw new \Exception('Usuario no encontrado');
        }
        $usuario->update([
            'estado' => $dto->estado
        ]);
        $usuario->load('rol');
        return $usuario;
    }
}
