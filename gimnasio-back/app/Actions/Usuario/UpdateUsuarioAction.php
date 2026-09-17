<?php

namespace App\Actions\Usuario;

use App\DTOs\Usuario\UpdateUsuarioDTO;
use App\Models\Rol;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;

class UpdateUsuarioAction
{
    public function execute(UpdateUsuarioDTO $dto): Usuario
    {
        $usuario = Usuario::find($dto->id);
        if (!$usuario) {
            throw new \Exception('Usuario no encontrado');
        }

        $rol = Rol::whereRaw('LOWER(nombre) = ?', [strtolower($dto->rol)])->firstOrFail();

        $dataToUpdate = [
            'nombre' => $dto->nombre,
            'apellido' => $dto->apellido,
            'email' => $dto->email,
            'id_rol' => $rol->id,
            'codigo' => $dto->codigo,
            'celular' => $dto->celular,
            'ci' => $dto->ci,
            'tipo_usuario' => $dto->tipo_usuario ?? $usuario->tipo_usuario,
        ];

        if (!empty($dto->password)) {
            $dataToUpdate['password'] = Hash::make($dto->password);
        }

        if ($dto->estado !== null) {
            $dataToUpdate['estado'] = $dto->estado;
        }

        $usuario->update($dataToUpdate);
        $usuario->load('rol');

        return $usuario;
    }
}
