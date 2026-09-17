<?php

namespace App\Http\Requests\Historial;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAntecedenteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'observaciones' => 'nullable|string',
            'tiene_enfermedades_cardiovasculares' => 'nullable|boolean',
            'detalle_enfermedades_cardiovasculares' => 'nullable|string',
            'tiene_hipertension_arterial' => 'nullable|boolean',
            'detalle_hipertension_arterial' => 'nullable|string',
            'tiene_enfermedades_pulmonares' => 'nullable|boolean',
            'detalle_enfermedades_pulmonares' => 'nullable|string',
            'tiene_diabetes' => 'nullable|boolean',
            'detalle_diabetes' => 'nullable|string',
            'tiene_lesiones' => 'nullable|boolean',
            'detalle_lesiones' => 'nullable|string',
            'tiene_alergias' => 'nullable|boolean',
            'detalle_alergias' => 'nullable|string',
        ];
    }
}
