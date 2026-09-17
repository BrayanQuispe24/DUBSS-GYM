<?php

namespace App\Http\Requests\Inventario;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMantenimientoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tipo' => ['sometimes', 'required', 'string', 'max:255'],
            'fecha_inicio' => ['sometimes', 'required', 'date'],
            'fecha_fin' => ['nullable', 'date'],
            'descripcion' => ['nullable', 'string'],
            'costo' => ['nullable', 'numeric', 'min:0'],
            'estado' => ['sometimes', 'nullable'],
            'proximo_mantenimiento' => ['nullable', 'date'],
            'observacion' => ['nullable', 'string'],
            'id_equipo' => ['sometimes', 'required', 'exists:equipos,id'],
            'cantidad' => ['sometimes', 'nullable', 'integer', 'min:1'],
        ];
    }
}
