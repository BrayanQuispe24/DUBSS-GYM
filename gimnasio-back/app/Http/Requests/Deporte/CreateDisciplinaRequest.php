<?php

namespace App\Http\Requests\Deporte;

use Illuminate\Foundation\Http\FormRequest;

class CreateDisciplinaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => 'required|string|max:100|unique:disciplinas,nombre',
            'cantidad_cupos' => 'required|integer|min:1',
            'estado' => 'nullable|string',
        ];
    }
}
