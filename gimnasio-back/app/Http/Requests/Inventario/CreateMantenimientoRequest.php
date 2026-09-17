<?php

namespace App\Http\Requests\Inventario;

use Illuminate\Foundation\Http\FormRequest;

class CreateMantenimientoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tipo' => ['required', 'string', 'max:255'],
            'fecha_inicio' => ['required', 'date'],
            'fecha_fin' => ['nullable', 'date', 'after_or_equal:fecha_inicio'],
            'descripcion' => ['nullable', 'string'],
            'costo' => ['nullable', 'numeric', 'min:0'],
            'estado' => ['nullable'],
            'proximo_mantenimiento' => ['nullable', 'date'],
            'observacion' => ['nullable', 'string'],
            'id_equipo' => ['required', 'exists:equipos,id'],
            'cantidad' => ['nullable', 'integer', 'min:1'],
        ];
    }
}
