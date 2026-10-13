<?php

namespace App\Http\Controllers;

use App\Models\PerfilEntrenamiento;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PerfilEntrenamientoController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $idUsuario = $request->user()->id;
        $perfil = PerfilEntrenamiento::with('ultimoAnalisis')
            ->where('id_usuario', $idUsuario)
            ->first();

        return response()->json([
            'message' => 'Perfil de entrenamiento obtenido exitosamente',
            'data' => $perfil,
        ]);
    }

    public function storeOrUpdate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'edad' => 'nullable|integer|min:10|max:100',
            'objetivo' => 'required|string|in:HIPERTROFIA,FUERZA,RESISTENCIA,ACONDICIONAMIENTO',
            'nivel_experiencia' => 'required|string|in:PRINCIPIANTE,INTERMEDIO,AVANZADO',
            'dias_disponibles' => 'required|integer|min:1|max:7',
            'duracion_sesion_min' => 'required|integer|min:20|max:180',
            'equipamiento_disponible' => 'nullable|array',
            'restricciones_declaradas' => 'nullable|array',
            'id_ultimo_analisis' => 'nullable|exists:analisis_corporales,id',
        ]);

        $idUsuario = $request->user()->id;

        $perfil = PerfilEntrenamiento::updateOrCreate(
            ['id_usuario' => $idUsuario],
            $validated
        );

        $perfil->load('ultimoAnalisis');

        return response()->json([
            'message' => 'Perfil de entrenamiento guardado exitosamente',
            'data' => $perfil,
        ]);
    }
}
