<?php

namespace App\Http\Controllers;

use App\Http\Requests\Entrenamiento\UploadEjercicioImagenRequest;
use App\Models\Ejercicio;
use App\Models\EjercicioImagen;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class EjercicioImagenController extends Controller
{
    public function index(int $idEjercicio): JsonResponse
    {
        $ejercicio = Ejercicio::findOrFail($idEjercicio);
        $imagenes = $ejercicio->imagenes()->get();

        return response()->json([
            'message' => 'Imágenes de la galería obtenidas exitosamente',
            'data' => $imagenes,
        ]);
    }

    public function store(int $idEjercicio, UploadEjercicioImagenRequest $request): JsonResponse
    {
        $ejercicio = Ejercicio::findOrFail($idEjercicio);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->store('ejercicios', 'public');
            $fullUrl = asset('storage/'.$path);

            $imagen = EjercicioImagen::create([
                'id_ejercicio' => $ejercicio->id,
                'path_imagen' => $fullUrl,
                'titulo' => $request->validated('titulo'),
                'descripcion' => $request->validated('descripcion'),
                'orden' => $request->validated('orden') ?? 0,
            ]);

            return response()->json([
                'message' => 'Imagen guardada exitosamente en la galería',
                'data' => $imagen,
            ], 201);
        }

        return response()->json(['message' => 'No se proporcionó ningún archivo de imagen'], 400);
    }

    public function destroy(int $id): JsonResponse
    {
        $imagen = EjercicioImagen::findOrFail($id);

        // Intentar eliminar el archivo físico del almacenamiento local si existe
        $relativePath = str_replace(asset('storage/'), '', $imagen->path_imagen);
        if (Storage::disk('public')->exists($relativePath)) {
            Storage::disk('public')->delete($relativePath);
        }

        $imagen->delete();

        return response()->json([
            'message' => 'Imagen eliminada exitosamente de la galería',
        ]);
    }
}
