<?php

namespace App\Http\Requests\Entrenamiento;

use Illuminate\Foundation\Http\FormRequest;

class CreateEjercicioRequest extends FormRequest
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
            'url_video' => 'nullable|string|max:500',
            'id_tipo_ejercicio' => 'nullable|exists:tipo_ejercicio,id',
        ];
    }
}
