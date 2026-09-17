<?php

namespace App\Http\Requests\Inventario;

use Illuminate\Foundation\Http\FormRequest;

class CreateTipoMovimientoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => ['required', 'string', 'max:255', 'unique:tipo_movimiento,nombre'],
            'descripcion' => ['nullable', 'string'],
            'es_salida' => ['nullable', 'boolean'],
        ];
    }
}
