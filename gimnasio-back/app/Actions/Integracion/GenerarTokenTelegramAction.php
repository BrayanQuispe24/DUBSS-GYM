<?php

namespace App\Actions\Integracion;

use App\Models\TelegramVinculacionToken;
use App\Models\Usuario;
use Illuminate\Support\Str;

class GenerarTokenTelegramAction
{
    /**
     * Genera un nuevo token temporal de vinculación para el usuario autenticado.
     *
     * @param Usuario $usuario
     * @param int $vigenciaMinutos
     * @return array
     */
    public function execute(Usuario $usuario, int $vigenciaMinutos = 15): array
    {
        // Invalidar tokens previos no utilizados marcando fecha de expiración pasada
        TelegramVinculacionToken::where('id_usuario', $usuario->id)
            ->whereNull('used_at')
            ->where('expires_at', '>', now())
            ->update(['expires_at' => now()]);

        // Generar un código único amigable de 6 caracteres alfanuméricos en mayúscula
        do {
            $codigo = 'TG-' . strtoupper(Str::random(6));
        } while (TelegramVinculacionToken::where('token', $codigo)->exists());

        $expiresAt = now()->addMinutes($vigenciaMinutos);

        $tokenRecord = TelegramVinculacionToken::create([
            'id_usuario' => $usuario->id,
            'token' => $codigo,
            'expires_at' => $expiresAt,
        ]);

        $botUsername = config('services.telegram.bot_username', 'dubss_gym_bot');

        return [
            'token' => $tokenRecord->token,
            'expires_at' => $tokenRecord->expires_at->toIso8601String(),
            'expires_in_minutes' => $vigenciaMinutos,
            'bot_username' => $botUsername,
            'deep_link' => "https://t.me/{$botUsername}?start={$tokenRecord->token}",
        ];
    }
}

