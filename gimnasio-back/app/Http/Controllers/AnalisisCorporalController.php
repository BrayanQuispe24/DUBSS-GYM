<?php

namespace App\Http\Controllers;

use App\Models\AnalisisCorporal;
use App\Services\IAServiceClient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Throwable;

class AnalisisCorporalController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $idUsuario = $request->user()->id;
        $analisis = AnalisisCorporal::where('id_usuario', $idUsuario)
            ->orderBy('fecha_analisis', 'desc')
            ->get();

        return response()->json([
            'message' => 'Historial de análisis corporales obtenido exitosamente',
            'data' => $analisis,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $analisis = AnalisisCorporal::findOrFail($id);

        return response()->json([
            'message' => 'Detalle del análisis corporal obtenido exitosamente',
            'data' => $analisis,
        ]);
    }

    public function store(Request $request, IAServiceClient $iaClient): JsonResponse
    {
        $request->validate([
            'foto_frontal' => 'required|image|max:10240',
            'foto_perfil' => 'required|image|max:10240',
            'foto_espalda' => 'required|image|max:10240',
        ]);

        $usuario = $request->user();

        try {
            // 1. Guardar archivos de fotos localmente en storage público
            $pathFrontal = $request->file('foto_frontal')->store('analisis_corporales', 'public');
            $pathPerfil = $request->file('foto_perfil')->store('analisis_corporales', 'public');
            $pathEspalda = $request->file('foto_espalda')->store('analisis_corporales', 'public');

            // 2. Invocar microservicio de IA Python
            $resIA = $iaClient->analizarFotografias(
                $request->file('foto_frontal'),
                $request->file('foto_perfil'),
                $request->file('foto_espalda')
            );

            // 3. Persistir en la base de datos
            $analisis = AnalisisCorporal::create([
                'id_usuario' => $usuario->id,
                'fecha_analisis' => now(),
                'path_foto_frontal' => Storage::url($pathFrontal),
                'path_foto_perfil' => Storage::url($pathPerfil),
                'path_foto_espalda' => Storage::url($pathEspalda),
                'puntos_frontales' => $resIA['analisis_vistas']['frontal']['landmarks'] ?? [],
                'puntos_perfil' => $resIA['analisis_vistas']['perfil']['landmarks'] ?? [],
                'puntos_espalda' => $resIA['analisis_vistas']['espalda']['landmarks'] ?? [],
                'metricas_calculadas' => $resIA['metricas'] ?? [],
                'calidad_analisis' => $resIA['calidad_global'] ?? 'ACEPTABLE',
                'confianza_promedio' => $resIA['confianza_promedio_global'] ?? 0.0,
                'version_procesamiento' => $resIA['version_procesamiento'] ?? 'v1.0',
                'observaciones' => implode("\n", $resIA['observaciones'] ?? []),
            ]);

            return response()->json([
                'message' => 'Análisis corporal con MediaPipe procesado exitosamente',
                'data' => $analisis,
            ], 201);
        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Error al procesar el análisis corporal',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
