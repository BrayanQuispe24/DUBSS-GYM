<?php

namespace App\Http\Requests\Historial;

use Illuminate\Foundation\Http\FormRequest;

class CreateAntecedenteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id_historial' => 'required|exists:historiales,id',
            'observaciones' => 'nullable|string',
            'tiene_enfermedades_cardiovasculares' => 'nullable|boolean',
            'detalle_enfermedades_cardiovasculares' => 'nullable|string',
            'se_realizo_intervencion_cardiovascular' => 'nullable|boolean',
            'detalle_intervencion_cardiovascular' => 'nullable|string',
            'tiene_hipertension_arterial' => 'nullable|boolean',
            'detalle_hipertension_arterial' => 'nullable|string',
            'tiene_enfermedades_pulmonares' => 'nullable|boolean',
            'detalle_enfermedades_pulmonares' => 'nullable|string',
            'tiene_diabetes' => 'nullable|boolean',
            'detalle_diabetes' => 'nullable|string',
            'tiene_enfermedades_osteoarticulares' => 'nullable|boolean',
            'detalle_enfermedades_osteoarticulares' => 'nullable|string',
            'tiene_enfermedades_neurologicas' => 'nullable|boolean',
            'detalle_enfermedades_neurologicas' => 'nullable|string',
            'tiene_convulsiones' => 'nullable|boolean',
            'detalle_convulsiones' => 'nullable|string',
            'tiene_intervencion_quirurgica' => 'nullable|boolean',
            'detalle_intervencion_quirurgica' => 'nullable|string',
            'sufrio_fracturas_oseas' => 'nullable|boolean',
            'detalle_fracturas_oseas' => 'nullable|string',
            'sufrio_algun_sintoma_durante_deporte' => 'nullable|boolean',
            'detalle_sintomas_durante_deporte' => 'nullable|string',
            'tiene_lesiones' => 'nullable|boolean',
            'detalle_lesiones' => 'nullable|string',
            'tiene_alergias' => 'nullable|boolean',
            'detalle_alergias' => 'nullable|string',
        ];
    }
}
