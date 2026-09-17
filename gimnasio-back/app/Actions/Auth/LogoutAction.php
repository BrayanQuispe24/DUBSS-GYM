<?php

namespace App\Actions\Auth;

use App\Models\Usuario;

class LogoutAction
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function execute(Usuario $usuario): void
    {
        $usuario->tokens()->delete();
    }
}
