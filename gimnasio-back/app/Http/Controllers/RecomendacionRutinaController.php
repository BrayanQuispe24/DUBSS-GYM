<?php

namespace App\Http\Controllers;

use App\Models\PerfilEntrenamiento;
use App\Models\PlanEntrenamiento;
use App\Models\PlanEntrenamientoRutina;
use App\Models\Rutina;
use App\Models\RutinaEjercicio;
use App\Services\IAServiceClient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;

class RecomendacionRutinaController extends Controller
{
    public function generarRutina(Request $request, IAServiceClient $iaClient): JsonResponse
    {
        $usuarioAuth = $request->user();
        $idTargetUsuario = $request->input('id_usuario', $usuarioAuth->id);

        // Si es otro usuario, validar que el solicitante sea admin o instructor
        if ($idTargetUsuario !== $usuarioAuth->id && ! $usuarioAuth->puedeGestionarEntrenamiento()) {
            return response()->json(['message' => 'No autorizado para asignar rutinas a otros usuarios.'], 403);
        }

        // 1. Obtener o validar perfil del usuario objetivo
        $perfil = PerfilEntrenamiento::with('ultimoAnalisis')
            ->where('id_usuario', $idTargetUsuario)
            ->first();

        if (! $perfil) {
            return response()->json([
                'message' => 'Es necesario completar el perfil de entrenamiento antes de solicitar una recomendación por IA.',
            ], 422);
        }

        try {
            DB::beginTransaction();

            // 2. Invocar servicio de IA (Motor de Reglas)
            $resIA = $iaClient->generarRecomendacionRutina($perfil);

            // 3. Crear Plan de Entrenamiento Principal
            $plan = PlanEntrenamiento::create([
                'id_usuario' => $idTargetUsuario,
                'nombre' => $resIA['rutina_nombre'] ?? "Plan de Entrenamiento IA - {$perfil->objetivo}",
                'objetivo' => $perfil->objetivo,
                'fecha_inicio' => now(),
                'fecha_fin' => now()->addWeeks(8),
                'estado' => true,
                'observacion' => $resIA['justificacion_detallada'] ?? 'Rutina generada por Sistema Experto IA.',
            ]);

            $rutinasCreadas = [];

            // 4. Crear Rutinas por cada Día del Split
            foreach ($resIA['dias_semana'] as $dia) {
                $rutina = Rutina::create([
                    'nombre' => "{$dia['nombre_dia']} - {$dia['enfoque_muscular']}",
                    'descripcion' => "Enfoque: {$dia['enfoque_muscular']}",
                    'nivel' => $perfil->nivel_experiencia,
                    'estado' => true,
                    'generado_por_ia' => true,
                    'justificacion_reglas' => $resIA['reglas_aplicadas'] ?? [],
                    'id_perfil_entrenamiento' => $perfil->id,
                ]);

                // Enlazar Rutina al Plan con el Día de la Semana
                PlanEntrenamientoRutina::create([
                    'id_plan_entrenamiento' => $plan->id,
                    'id_rutina' => $rutina->id,
                    'dia_semana' => "Día {$dia['dia_numero']}",
                ]);

                // Asignar Ejercicios a la Rutina
                foreach ($dia['ejercicios'] as $ejAsignado) {
                    $seriesInt = (int) ($ejAsignado['series'] ?? 3);
                    $repsInt = 10;
                    if (preg_match('/(\d+)\s*-\s*(\d+)/', $ejAsignado['repeticiones'], $matches)) {
                        $repsInt = (int) $matches[2];
                    }

                    RutinaEjercicio::create([
                        'id_rutina' => $rutina->id,
                        'id_ejercicio' => $ejAsignado['id_ejercicio'],
                        'series' => $seriesInt,
                        'repeticiones' => $repsInt,
                        'descanso_segundos' => $ejAsignado['descanso_segundos'] ?? 60,
                        'orden' => $ejAsignado['orden'] ?? 1,
                        'observacion' => $ejAsignado['observaciones'] ?? null,
                    ]);
                }

                $rutina->load(['rutinaEjercicios.ejercicio.imagenes']);
                $rutinasCreadas[] = $rutina;
            }

            DB::commit();

            return response()->json([
                'message' => 'Rutina personalizada generada y almacenada exitosamente por el Sistema Experto.',
                'data' => [
                    'plan' => $plan,
                    'rutinas' => $rutinasCreadas,
                    'reglas_aplicadas' => $resIA['reglas_aplicadas'] ?? [],
                    'justificacion' => $resIA['justificacion_detallada'] ?? '',
                    'observaciones' => $resIA['observaciones'] ?? [],
                ],
            ], 201);
        } catch (Throwable $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Error al generar la rutina personalizada con IA.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function obtenerRutinasUsuario(Request $request, int $id_usuario): JsonResponse
    {
        // Verificar autorización (usuario actual o admin/instructor)
        if ($request->user()->id !== (int) $id_usuario && ! $request->user()->puedeGestionarEntrenamiento()) {
            return response()->json(['message' => 'No autorizado para consultar estas rutinas.'], 403);
        }

        $planes = PlanEntrenamiento::with(['planEntrenamientoRutinas.rutina.rutinaEjercicios.ejercicio.imagenes'])
            ->where('id_usuario', $id_usuario)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'message' => 'Rutinas obtenidas exitosamente',
            'data' => $planes,
        ]);
    }
}
