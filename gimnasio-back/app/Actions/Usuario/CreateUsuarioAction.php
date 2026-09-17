<?php

namespace App\Actions\Usuario;

use App\DTOs\Usuario\CreateUsuarioDTO;
use App\Models\Rol;
use App\Models\Usuario;
use App\Services\MailService;
use Illuminate\Support\Facades\Hash;

class CreateUsuarioAction
{
    public function __construct(
        protected MailService $mailService
    ) {}

    public function execute(CreateUsuarioDTO $dto): Usuario
    {
        $rol = Rol::whereRaw('LOWER(nombre) = ?', [strtolower($dto->rol)])->firstOrFail();
        $usuario = Usuario::create([
            'nombre' => $dto->nombre,
            'apellido' => $dto->apellido,
            'email' => $dto->email,
            'password' => Hash::make($dto->password),
            'id_rol' => $rol->id,
            'codigo' => $dto->codigo,
            'celular' => $dto->celular,
            'ci' => $dto->ci,
            'tipo_usuario' => $dto->tipo_usuario,
            'estado' => $dto->estado ?? true,
            'acepta_terminos' => true,
            'fecha_acepta_terminos' => now(),
        ]);
        
        $usuario->load('rol');

        // Enviar correo de confirmación de registro y Términos & Condiciones
        $this->mailService->sendTerminosYCondiciones($usuario);

        return $usuario;
    }
}
