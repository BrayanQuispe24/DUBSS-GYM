<?php

namespace App\Actions\Auth;

use App\DTOs\Auth\LoginUserDTo;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class LoginUserAction
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function execute(LoginUserDTo $dto): array
    {
        $usuario = Usuario::where('email', '=', $dto->email)->first();

        if (! $usuario || ! Hash::check($dto->password, $usuario->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        $token = $usuario->createToken('auth_token')->plainTextToken;
        $usuario->load('rol');

        return [
            'usuario' => $usuario,
            'token' => $token,
            'token_type' => 'Bearer',
        ];
    }
}
