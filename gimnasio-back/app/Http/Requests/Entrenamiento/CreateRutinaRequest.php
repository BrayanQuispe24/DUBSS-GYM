<?php

namespace App\Http\Requests\Entrenamiento;

use Illuminate\Foundation\Http\FormRequest;

class CreateRutinaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => 'required|string|max:100',
            'descripcion' => 'nullable|string',
            'nivel' => 'nullable|string|max:50',
            'estado' => 'boolean',
            'ejercicios' => 'nullable|array',
            'ejercicios.*.id_ejercicio' => 'required|exists:ejercicios,id',
            'ejercicios.*.series' => 'nullable|integer|min:1',
            'ejercicios.*.repeticiones' => 'nullable|integer|min:1',
            'ejercicios.*.peso' => 'nullable|numeric|min:0',
            'ejercicios.*.duracion_segundos' => 'nullable|integer|min:0',
            'ejercicios.*.descanso_segundos' => 'nullable|integer|min:0',
            'ejercicios.*.orden' => 'nullable|integer|min:1',
            'ejercicios.*.observacion' => 'nullable|string',
        ];
    }
}
