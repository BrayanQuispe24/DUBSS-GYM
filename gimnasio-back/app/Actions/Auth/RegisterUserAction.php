<?php

namespace App\Actions\Auth;

use App\DTOs\Auth\RegisterUserDTO;
use App\Models\Rol;
use App\Models\Usuario;
use App\Services\MailService;
use Illuminate\Support\Facades\Hash;

class RegisterUserAction
{
    public function __construct(
        protected MailService $mailService
    ) {}

    public function execute(RegisterUserDTO $dto): array
    {
        $rol = Rol::where('nombre', $dto->rol)->firstOrFail();

        $usuario = Usuario::create([
            'codigo' => $dto->codigo,
            'nombre' => $dto->nombre,
            'apellido' => $dto->apellido,
            'email' => $dto->email,
            'password' => Hash::make($dto->password),
            'ci' => $dto->ci,
            'celular' => $dto->celular,
            'tipo_usuario' => $dto->tipo_usuario ?? 'estudiante',
            'acepta_terminos' => true,
            'fecha_acepta_terminos' => now(),
            'id_rol' => $rol->id,
            'fecha_registro' => now(),
        ]);
        $token = $usuario->createToken('auth_token')->plainTextToken;
        $usuario->load('rol');

        // Delegar el envío del correo con Términos y Condiciones al MailService
        $this->mailService->sendTerminosYCondiciones($usuario);

        return [
            'usuario' => $usuario,
            'token' => $token,
            'token_type' => 'Bearer',
        ];
    }
}
