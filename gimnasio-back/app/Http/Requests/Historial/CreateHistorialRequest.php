<?php

namespace App\Http\Requests\Historial;

use Illuminate\Foundation\Http\FormRequest;

class CreateHistorialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'fecha_apertura' => 'nullable|date',
            'observaciones_generales' => 'nullable|string',
            'observaciones' => 'nullable|string',
            'grupo_sanguineo' => 'nullable|string|max:10',
            'sexo' => 'nullable|string|max:20',
            'fecha_nacimiento' => 'nullable|date',
            'domicilio' => 'nullable|string|max:255',
            'celular_emergencia' => 'nullable|string|max:30',
        ];
    }
}
