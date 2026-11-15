<?php

namespace App\Actions\Tramite;

use App\Models\BoletaInscripcion;
use Carbon\Carbon;

class ListarMembresiasVencimientoAction
{
    /**
     * Obtener listado de membresías por vencer formateadas para notificaciones (n8n / Telegram).
     *
     * @param array{
     *     dias?: int|string|null,
     *     solo_telegram?: bool|string|null,
     *     estado?: string|null
     * } $filtros
     * @return array<int, array{
     *     boleta_id: int,
     *     cliente_id: int,
     *     nombre: string,
     *     fecha_vencimiento: string,
     *     dias_restantes: int,
     *     estado: string,
     *     telegram_chat_id: ?string
     * }>
     */
    public function execute(array $filtros = []): array
    {
        $dias = isset($filtros['dias']) && is_numeric($filtros['dias']) ? (int) $filtros['dias'] : null;
        $soloTelegram = filter_var($filtros['solo_telegram'] ?? false, FILTER_VALIDATE_BOOLEAN);
        $estado = isset($filtros['estado']) ? (string) $filtros['estado'] : null;

        $today = Carbon::today();

        $query = BoletaInscripcion::query()
            ->with(['usuario']);

        if ($estado !== null && trim($estado) !== '') {
            $query->whereRaw('LOWER(estado) = ?', [mb_strtolower(trim($estado))]);
        } else {
            $query->whereRaw('LOWER(estado) IN (?, ?)', ['activo', 'activa']);
        }

        if ($dias !== null) {
            $maxDate = $today->copy()->addDays($dias);
            $query->whereBetween('fecha_fin', [$today->toDateString(), $maxDate->toDateString()]);
        } else {
            $query->where('fecha_fin', '>=', $today->toDateString());
        }

        if ($soloTelegram) {
            $query->whereHas('usuario', function ($q) {
                $q->whereNotNull('telegram_chat_id')
                    ->whereRaw("TRIM(telegram_chat_id) != ''");
            });
        }

        $boletas = $query->orderBy('fecha_fin', 'asc')->get();

        return $boletas->map(function (BoletaInscripcion $boleta) use ($today): array {
            $fechaFin = $boleta->fecha_fin ? Carbon::parse($boleta->fecha_fin) : $today;
            $diasRestantes = (int) $today->diffInDays($fechaFin, false);

            $estadoNormalizado = mb_strtolower((string) $boleta->estado) === 'activo'
                ? 'activa'
                : (string) $boleta->estado;

            return [
                'boleta_id' => (int) $boleta->id,
                'cliente_id' => (int) ($boleta->id_usuario ?? $boleta->usuario?->id ?? 0),
                'nombre' => (string) ($boleta->usuario?->nombre ?? 'Cliente'),
                'fecha_vencimiento' => $fechaFin->format('Y-m-d'),
                'dias_restantes' => max(0, $diasRestantes),
                'estado' => $estadoNormalizado,
                'telegram_chat_id' => $boleta->usuario?->telegram_chat_id !== null && trim((string) $boleta->usuario->telegram_chat_id) !== ''
                    ? (string) $boleta->usuario->telegram_chat_id
                    : null,
            ];
        })->values()->all();
    }
}

