<?php

namespace App\Actions\Acceso;

use App\Models\BoletaInscripcion;
use App\Models\RegistroEntradaSalida;
use Carbon\Carbon;

class ValidarAccesoQRAction
{
    public function execute(string|array $qrInput, string $modoTipo = 'auto'): array
    {
        // 1. Parse payload
        if (is_array($qrInput)) {
            $data = $qrInput;
        } else {
            $data = json_decode($qrInput, true);
        }

        if (! $data || ! is_array($data) || empty($data['boleta_id'])) {
            return [
                'permitido' => false,
                'motivo' => 'FORMATO_INVALIDO',
                'mensaje' => 'CÓDIGO QR INVÁLIDO: Estructura de datos no reconocida.',
            ];
        }

        // 2. Validate Security Signature
        $signature = $data['signature'] ?? '';
        $dataCopy = $data;
        unset($dataCopy['signature']);

        $payloadJson = json_encode($dataCopy, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $appKey = config('app.key') ?? 'DUBSS_GYM_SECRET_KEY';
        $computedSignature = hash_hmac('sha256', $payloadJson, $appKey);

        if (! hash_equals($computedSignature, $signature)) {
            return [
                'permitido' => false,
                'motivo' => 'FIRMA_INVALIDA',
                'mensaje' => 'ALERTA DE SEGURIDAD: Código QR alterado o fraudulento.',
            ];
        }

        // 3. Retrieve DB Record
        $boleta = BoletaInscripcion::with(['usuario', 'tarifa', 'disciplinaHorario.horario'])->find($data['boleta_id']);
        if (! $boleta) {
            return [
                'permitido' => false,
                'motivo' => 'BOLETA_NO_ENCONTRADA',
                'mensaje' => 'ACCESO DENEGADO: La Boleta de Inscripción no existe en el sistema.',
            ];
        }

        if (strtolower($boleta->estado ?? '') !== 'activo') {
            return [
                'permitido' => false,
                'motivo' => 'MEMBRESIA_INACTIVA',
                'mensaje' => "ACCESO DENEGADO: La membresía se encuentra en estado '".strtoupper($boleta->estado)."'.",
            ];
        }

        // 4. Date Validity Check (fecha_inicio <= hoy <= fecha_fin)
        $tz = config('app.timezone', 'America/La_Paz');
        $ahora = Carbon::now($tz);
        $hoyStr = $ahora->toDateString();
        $hoy = $ahora->copy()->startOfDay();

        $fechaInicio = $boleta->fecha_inicio ? Carbon::parse($boleta->fecha_inicio, $tz)->startOfDay() : null;
        $fechaFin = $boleta->fecha_fin ? Carbon::parse($boleta->fecha_fin, $tz)->endOfDay() : null;

        if ($fechaInicio && $hoy->lt($fechaInicio)) {
            return [
                'permitido' => false,
                'motivo' => 'VIGENCIA_NO_INICIADA',
                'mensaje' => "ACCESO DENEGADO: La membresía aún no ha iniciado su período de vigencia (Inicia: {$boleta->fecha_inicio}).",
            ];
        }

        if ($fechaFin && $hoy->gt($fechaFin)) {
            return [
                'permitido' => false,
                'motivo' => 'MEMBRESIA_VENCIDA',
                'mensaje' => "ACCESO DENEGADO: La membresía se encuentra vencida (Venció el {$boleta->fecha_fin}).",
            ];
        }

        // 5. Determine Target Action ('entrada' vs 'salida')
        $ultimoRegistro = RegistroEntradaSalida::where('id_boleta_inscripcion', $boleta->id)
            ->whereDate('fecha_hora', $hoyStr)
            ->latest('id')
            ->first();

        $modoRequested = strtolower($modoTipo ?? 'auto');
        $targetAccion = 'entrada';

        if ($modoRequested === 'auto') {
            if ($ultimoRegistro && strtolower($ultimoRegistro->tipo) === 'entrada') {
                $targetAccion = 'salida';
            } else {
                $targetAccion = 'entrada';
            }
        } else {
            $targetAccion = in_array($modoRequested, ['entrada', 'salida']) ? $modoRequested : 'entrada';
        }

        $usuario = $boleta->usuario;
        $nombreSocio = $usuario ? trim("{$usuario->nombre} {$usuario->apellido}") : 'Socio UAGRM';
        if (empty($nombreSocio) && $usuario) {
            $nombreSocio = $usuario->email;
        }

        $diasConfigurados = $boleta->disciplinaHorario?->horario?->dia_semana;
        $horaInicio = $boleta->hora_inicio ? Carbon::parse($boleta->hora_inicio, $tz)->format('H:i:s') : '07:00:00';
        $horaSalida = $boleta->hora_salida ? Carbon::parse($boleta->hora_salida, $tz)->format('H:i:s') : '22:00:00';
        $horarioTexto = ($diasConfigurados ? "{$diasConfigurados} · " : '').substr($horaInicio, 0, 5).' - '.substr($horaSalida, 0, 5);

        // 6. PROCESS EXIT (SALIDA)
        if ($targetAccion === 'salida') {
            // Calculate workout duration if last entry exists
            $duracionTexto = 'Duración no especificada';
            if ($ultimoRegistro && strtolower($ultimoRegistro->tipo) === 'entrada') {
                $horaEntrada = Carbon::parse($ultimoRegistro->fecha_hora, $tz);
                $minutosDiff = (int) $horaEntrada->diffInMinutes($ahora);
                $horas = floor($minutosDiff / 60);
                $minsRestantes = $minutosDiff % 60;

                if ($horas > 0) {
                    $duracionTexto = "{$horas}h {$minsRestantes}m";
                } else {
                    $duracionTexto = "{$minutosDiff} minutos";
                }
            }

            // Prevent duplicate exit scans within 2 minutes
            if ($ultimoRegistro && strtolower($ultimoRegistro->tipo) === 'salida') {
                $hSalida = Carbon::parse($ultimoRegistro->fecha_hora, $tz);
                if ($hSalida->diffInMinutes($ahora) < 2) {
                    return [
                        'permitido' => false,
                        'motivo' => 'MARCACION_DUPLICADA',
                        'mensaje' => 'SALIDA REPETIDA: La salida de este socio fue registrada hace un momento.',
                    ];
                }
            }

            $registro = RegistroEntradaSalida::create([
                'fecha_hora' => $ahora,
                'tipo' => 'salida',
                'id_boleta_inscripcion' => $boleta->id,
                'id_usuario' => $boleta->id_usuario,
            ]);

            return [
                'permitido' => true,
                'tipo_marcacion' => 'salida',
                'motivo' => 'SALIDA_REGISTRADA',
                'mensaje' => '¡SALIDA REGISTRADA! Gracias por su visita al Gimnasio DUBSS UAGRM.',
                'duracion' => $duracionTexto,
                'data' => [
                    'registro_id' => $registro->id,
                    'numero_boleta' => $boleta->numero_boleta,
                    'socio' => $nombreSocio,
                    'ci' => $usuario->ci ?? 'Sin C.I.',
                    'registro_universitario' => $usuario->registro_universitario ?? 'S/N',
                    'disciplina' => $boleta->disciplina ?? 'Gimnasio Musculación',
                    'horario' => $horarioTexto,
                    'duracion' => $duracionTexto,
                    'fecha_hora_salida' => $ahora->format('d/m/Y H:i:s'),
                ],
            ];
        }

        // 7. PROCESS ENTRY (ENTRADA)
        // 7.1 VALIDACIÓN ESTRICTA DEL DÍA DE LA SEMANA
        if (! $this->esDiaPermitido($diasConfigurados, $ahora)) {
            $nombresDiasEsp = [
                1 => 'Lunes',
                2 => 'Martes',
                3 => 'Miércoles',
                4 => 'Jueves',
                5 => 'Viernes',
                6 => 'Sábado',
                7 => 'Domingo',
            ];
            $diaActualNombre = $nombresDiasEsp[$ahora->isoWeekday()] ?? 'hoy';

            return [
                'permitido' => false,
                'motivo' => 'DIA_NO_AUTORIZADO',
                'mensaje' => "ACCESO DENEGADO: Hoy es {$diaActualNombre} y su turno de membresía solo permite ingreso en los días: {$diasConfigurados}.",
            ];
        }

        // 7.2 VALIDACIÓN DE RANGO HORARIO
        $ahoraTime = $ahora->format('H:i:s');
        if ($ahoraTime < $horaInicio || $ahoraTime > $horaSalida) {
            $horaInicioTxt = substr($horaInicio, 0, 5);
            $horaSalidaTxt = substr($horaSalida, 0, 5);

            return [
                'permitido' => false,
                'motivo' => 'FUERA_DE_HORARIO',
                'mensaje' => "ACCESO DENEGADO: Intentando ingresar fuera del horario permitido. Turno en boleta: {$horaInicioTxt} - {$horaSalidaTxt}.",
            ];
        }

        // Prevent duplicate entry scans within 10 minutes
        $diezMinutosAtras = $ahora->copy()->subMinutes(10);
        $registroRecienteEntrada = RegistroEntradaSalida::where('id_boleta_inscripcion', $boleta->id)
            ->where('tipo', 'entrada')
            ->where('fecha_hora', '>=', $diezMinutosAtras)
            ->first();

        if ($registroRecienteEntrada) {
            $horaUltimaEntrada = Carbon::parse($registroRecienteEntrada->fecha_hora)->format('H:i');

            return [
                'permitido' => false,
                'motivo' => 'MARCACION_DUPLICADA',
                'mensaje' => "ACCESO REPETIDO: Ya se registró la entrada de este socio hace menos de 10 minutos (Marcación a las {$horaUltimaEntrada}).",
            ];
        }

        $registro = RegistroEntradaSalida::create([
            'fecha_hora' => $ahora,
            'tipo' => 'entrada',
            'id_boleta_inscripcion' => $boleta->id,
            'id_usuario' => $boleta->id_usuario,
        ]);

        return [
            'permitido' => true,
            'tipo_marcacion' => 'entrada',
            'motivo' => 'ACCESO_PERMITIDO',
            'mensaje' => '¡ENTRADA PERMITIDA! Marcación registrada exitosamente.',
            'data' => [
                'registro_id' => $registro->id,
                'numero_boleta' => $boleta->numero_boleta,
                'socio' => $nombreSocio,
                'ci' => $usuario->ci ?? 'Sin C.I.',
                'registro_universitario' => $usuario->registro_universitario ?? 'S/N',
                'disciplina' => $boleta->disciplina ?? 'Gimnasio Musculación',
                'horario' => $horarioTexto,
                'fecha_hora_ingreso' => $ahora->format('d/m/Y H:i:s'),
            ],
        ];
    }

    private function esDiaPermitido(?string $diasConfigurados, Carbon $ahora): bool
    {
        if (empty($diasConfigurados)) {
            return true;
        }

        $diasNorm = mb_strtolower($diasConfigurados, 'UTF-8');
        // Remover acentos para comparaciones uniformes
        $diasNorm = str_replace(['á', 'é', 'í', 'ó', 'ú'], ['a', 'e', 'i', 'o', 'u'], $diasNorm);

        // Pase libre o todos los días
        if (str_contains($diasNorm, 'todos los dias') || str_contains($diasNorm, 'lunes a domingo') || str_contains($diasNorm, 'pase libre')) {
            return true;
        }

        $isoDay = $ahora->isoWeekday(); // 1 = Lunes, ..., 7 = Domingo

        // Frecuencias continuas tipo Lunes a Viernes
        if (str_contains($diasNorm, 'lunes a viernes')) {
            if ($isoDay >= 1 && $isoDay <= 5) {
                return true;
            }
        }

        // Frecuencias de Fin de Semana
        if (str_contains($diasNorm, 'fin de semana') || str_contains($diasNorm, 'fines de semana')) {
            if ($isoDay >= 6) {
                return true;
            }
        }

        $nombresDias = [
            1 => 'lunes',
            2 => 'martes',
            3 => 'miercoles',
            4 => 'jueves',
            5 => 'viernes',
            6 => 'sabado',
            7 => 'domingo',
        ];

        $nombreHoy = $nombresDias[$isoDay] ?? '';

        return str_contains($diasNorm, $nombreHoy);
    }
}
