<?php

namespace App\Http\Requests\Entrenamiento;

use Illuminate\Foundation\Http\FormRequest;

class CreateGrupoMuscularRequest extends FormRequest
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
        ];
    }
}
