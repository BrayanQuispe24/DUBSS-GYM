<?php

namespace App\Actions\Integracion;

use App\Models\TelegramVinculacionToken;
use App\Models\Usuario;

class DesvincularClienteTelegramAction
{
    /**
     * Desvincula la cuenta de Telegram del usuario especificado.
     *
     * @param Usuario $usuario
     * @return bool
     */
    public function execute(Usuario $usuario): bool
    {
        $usuario->telegram_chat_id = null;
        $usuario->save();

        // Invalidar tokens activos pendientes
        TelegramVinculacionToken::where('id_usuario', $usuario->id)
            ->whereNull('used_at')
            ->update(['expires_at' => now()]);

        return true;
    }
}

