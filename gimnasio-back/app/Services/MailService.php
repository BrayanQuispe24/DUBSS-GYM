<?php

namespace App\Services;

use App\Mail\RegistroTerminosYCondicionesMail;
use App\Models\Usuario;
use Illuminate\Support\Facades\Mail;

class MailService
{
    /**
     * Encolar correo con los Términos y Condiciones tras el registro exitoso.
     */
    public function sendTerminosYCondiciones(Usuario $usuario): void
    {
        Mail::to($usuario->email)->queue(new RegistroTerminosYCondicionesMail($usuario));
    }
}
