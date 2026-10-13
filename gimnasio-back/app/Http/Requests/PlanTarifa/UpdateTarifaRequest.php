<?php

namespace App\Http\Requests\PlanTarifa;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTarifaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id' => 'required|exists:tarifas,id',
            'nombre' => 'sometimes|string|max:100',
            'precio' => 'sometimes|numeric|min:0',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
            'estado' => 'boolean',
        ];
    }
}
