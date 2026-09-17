<?php

namespace App\Http\Requests\Historial;

use Illuminate\Foundation\Http\FormRequest;

class CreateDetalleHistorialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id_historial' => 'required|exists:historiales,id',
            'peso' => 'nullable|numeric',
            'altura' => 'nullable|numeric',
            'imc' => 'nullable|numeric',
            'porcentaje_grasa' => 'nullable|numeric',
            'masa_muscular' => 'nullable|numeric',
            'presion' => 'nullable|string|max:50',
            'fecha_registro' => 'nullable|date',
        ];
    }
}
