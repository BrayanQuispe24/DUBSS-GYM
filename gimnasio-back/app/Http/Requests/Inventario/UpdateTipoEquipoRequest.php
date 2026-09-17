<?php

namespace App\Http\Requests\Inventario;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTipoEquipoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $tipoId = $this->route('tipo_equipo')?->id ?? $this->route('tipo_equipo');

        return [
            'nombre' => ['sometimes', 'required', 'string', 'max:255', 'unique:tipo_equipo,nombre,' . $tipoId],
            'descripcion' => ['nullable', 'string'],
            'estado' => ['sometimes', 'nullable'],
        ];
    }
}
