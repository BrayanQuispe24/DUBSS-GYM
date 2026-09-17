<?php

namespace App\Http\Requests\Espacio;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAmbienteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => ['sometimes', 'required', 'string', 'max:255'],
            'descripcion' => ['nullable', 'string'],
            'estado' => ['sometimes', 'nullable'],
        ];
    }
}
