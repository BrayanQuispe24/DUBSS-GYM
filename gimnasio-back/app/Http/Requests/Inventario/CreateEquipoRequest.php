<?php

namespace App\Http\Requests\Inventario;

use Illuminate\Foundation\Http\FormRequest;

class CreateEquipoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'codigo' => ['required', 'string', 'max:100', 'unique:equipos,codigo'],
            'nombre' => ['required', 'string', 'max:255'],
            'modelo' => ['nullable', 'string', 'max:255'],
            'fecha_adquisicion' => ['nullable', 'date'],
            'precio_compra' => ['nullable', 'numeric', 'min:0'],
            'estado' => ['nullable'],
            'cantidad' => ['nullable', 'integer', 'min:0'],
            'id_ambiente' => ['nullable', 'exists:ambientes,id'],
            'id_marca' => ['nullable', 'exists:marcas,id'],
            'id_tipo_equipo' => ['nullable', 'exists:tipo_equipo,id'],
        ];
    }
}
