<?php

namespace App\Http\Requests\PlanTarifa;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id' => 'required|exists:planes,id',
            'nombre' => 'sometimes|string|max:100',
            'descripcion' => 'nullable|string',
            'duracion_dias' => 'sometimes|integer|min:1',
            'estado' => 'boolean',
            'id_tarifa' => 'nullable|exists:tarifas,id',
        ];
    }
}
