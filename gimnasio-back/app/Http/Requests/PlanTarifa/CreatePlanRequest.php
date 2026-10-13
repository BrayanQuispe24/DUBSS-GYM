<?php

namespace App\Http\Requests\PlanTarifa;

use Illuminate\Foundation\Http\FormRequest;

class CreatePlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => 'required|string|max:100',
            'descripcion' => 'nullable|string',
            'duracion_dias' => 'required|integer|min:1',
            'estado' => 'boolean',
            'id_tarifa' => 'nullable|exists:tarifas,id',
        ];
    }
}
