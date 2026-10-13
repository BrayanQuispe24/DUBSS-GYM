<?php

namespace App\Http\Requests\Entrenamiento;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRutinaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => 'sometimes|required|string|max:100',
            'descripcion' => 'nullable|string',
            'nivel' => 'nullable|string|max:50',
            'estado' => 'nullable|boolean',
            'ejercicios' => 'nullable|array',
            'ejercicios.*.id_ejercicio' => 'required|exists:ejercicios,id',
            'ejercicios.*.series' => 'nullable|integer|min:1',
            'ejercicios.*.repeticiones' => 'nullable|integer|min:1',
            'ejercicios.*.descanso_segundos' => 'nullable|integer|min:0',
        ];
    }
}
