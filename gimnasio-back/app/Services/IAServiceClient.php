<?php

namespace App\Services;

use App\Models\Ejercicio;
use App\Models\PerfilEntrenamiento;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class IAServiceClient
{
    protected string $baseUrl;

    public function __construct()
    {
        $this->baseUrl = config('services.ia_service.url', 'http://127.0.0.1:8001/api/v1');
    }

    /**
     * Envía las 3 fotografías al microservicio de Python (MediaPipe Pose).
     */
    public function analizarFotografias(UploadedFile $fotoFrontal, UploadedFile $fotoPerfil, UploadedFile $fotoEspalda): array
    {
        try {
            $response = Http::timeout(30)
                ->attach('foto_frontal', file_get_contents($fotoFrontal->getRealPath()), $fotoFrontal->getClientOriginalName())
                ->attach('foto_perfil', file_get_contents($fotoPerfil->getRealPath()), $fotoPerfil->getClientOriginalName())
                ->attach('foto_espalda', file_get_contents($fotoEspalda->getRealPath()), $fotoEspalda->getClientOriginalName())
                ->post("{$this->baseUrl}/analisis-corporal");

            if ($response->failed()) {
                Log::error('Error en Microservicio IA (MediaPipe): '.$response->body());
                throw new Exception('No se pudo procesar las imágenes en el servicio de IA: '.$response->body());
            }

            return $response->json();
        } catch (Exception $e) {
            Log::error('Excepción al conectar con gimnasio-ia: '.$e->getMessage());
            throw $e;
        }
    }

    /**
     * Envía el perfil del usuario y el catálogo activo de ejercicios al Motor de Reglas.
     */
    public function generarRecomendacionRutina(PerfilEntrenamiento $perfil): array
    {
        try {
            // Cargar el catálogo completo de ejercicios estructurados
            $ejercicios = Ejercicio::with(['tipoEjercicio', 'ejercicioGrupoMusculares.grupoMuscular'])->get();

            $catalogoPayload = $ejercicios->map(function ($ej) {
                $primarios = [];
                $secundarios = [];

                foreach ($ej->ejercicioGrupoMusculares as $pivot) {
                    $nombreGrupo = $pivot->grupoMuscular?->nombre ?? '';
                    if ($pivot->tipo_participacion === 'primario') {
                        $primarios[] = $nombreGrupo;
                    } else {
                        $secundarios[] = $nombreGrupo;
                    }
                }

                return [
                    'id' => $ej->id,
                    'nombre' => $ej->nombre,
                    'equipamiento' => $ej->equipamiento,
                    'nivel_dificultad' => $ej->nivel_dificultad,
                    'mecanica' => $ej->mecanica,
                    'patron_movimiento' => $ej->patron_movimiento,
                    'grupos_musculares_primarios' => $primarios,
                    'grupos_musculares_secundarios' => $secundarios,
                ];
            })->toArray();

            $metricas = null;
            if ($perfil->ultimoAnalisis) {
                $metricas = $perfil->ultimoAnalisis->metricas_calculadas;
            }

            $perfilPayload = [
                'id_usuario' => $perfil->id_usuario,
                'edad' => $perfil->edad,
                'objetivo' => $perfil->objetivo,
                'nivel_experiencia' => $perfil->nivel_experiencia,
                'dias_disponibles' => $perfil->dias_disponibles,
                'duracion_sesion_min' => $perfil->duracion_sesion_min,
                'equipamiento_disponible' => $perfil->equipamiento_disponible ?? [],
                'restricciones_declaradas' => $perfil->restricciones_declaradas ?? [],
                'metricas_corporales' => $metricas,
            ];

            $response = Http::timeout(30)->post("{$this->baseUrl}/recomendaciones/rutina", [
                'perfil' => $perfilPayload,
                'catalogo' => $catalogoPayload,
            ]);

            if ($response->failed()) {
                Log::error('Error en Microservicio IA (Motor de Reglas): '.$response->body());
                throw new Exception('Error al solicitar la recomendación de rutina al servicio experto: '.$response->body());
            }

            return $response->json();
        } catch (Exception $e) {
            Log::error('Excepción al consultar el Motor de Reglas en gimnasio-ia: '.$e->getMessage());
            throw $e;
        }
    }
}
