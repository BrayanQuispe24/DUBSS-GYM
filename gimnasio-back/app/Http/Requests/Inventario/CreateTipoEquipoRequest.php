<?php

namespace App\Http\Requests\Inventario;

use Illuminate\Foundation\Http\FormRequest;

class CreateTipoEquipoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => ['required', 'string', 'max:255', 'unique:tipo_equipo,nombre'],
            'descripcion' => ['nullable', 'string'],
            'estado' => ['nullable'],
        ];
    }
}
