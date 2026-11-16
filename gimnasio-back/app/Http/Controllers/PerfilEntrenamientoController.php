<?php

namespace App\Http\Controllers;

use App\Models\PerfilEntrenamiento;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PerfilEntrenamientoController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $authUser = $request->user();
        $idUsuario = $authUser->id;

        if ($request->filled('id_usuario') && $authUser->puedeGestionarEntrenamiento()) {
            $idUsuario = (int) $request->input('id_usuario');
        }

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
            'id_usuario' => 'nullable|integer|exists:usuarios,id',
            'edad' => 'nullable|integer|min:10|max:100',
            'objetivo' => 'required|string|in:HIPERTROFIA,FUERZA,RESISTENCIA,ACONDICIONAMIENTO',
            'nivel_experiencia' => 'required|string|in:PRINCIPIANTE,INTERMEDIO,AVANZADO',
            'dias_disponibles' => 'required|integer|min:1|max:7',
            'duracion_sesion_min' => 'required|integer|min:20|max:180',
            'equipamiento_disponible' => 'nullable|array',
            'restricciones_declaradas' => 'nullable|array',
            'id_ultimo_analisis' => 'nullable|exists:analisis_corporales,id',
        ]);

        $authUser = $request->user();
        $idUsuario = $authUser->id;

        if (! empty($validated['id_usuario']) && $authUser->puedeGestionarEntrenamiento()) {
            $idUsuario = (int) $validated['id_usuario'];
        }

        unset($validated['id_usuario']);

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
