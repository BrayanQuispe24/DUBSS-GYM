<?php

namespace App\Http\Requests\Nutricion;

use Illuminate\Foundation\Http\FormRequest;

class CreatePlanAlimentacionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => 'required|string|max:100',
            'objetivo' => 'nullable|string',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
            'observacion' => 'nullable|string',
            'estado' => 'boolean',
            'id_usuario' => 'required|exists:usuarios,id',
            'detalles' => 'nullable|array',
            'detalles.*.dia_semana' => 'nullable|string|max:20',
            'detalles.*.tipo_comida' => 'nullable|string|max:50',
            'detalles.*.descripcion' => 'required|string',
            'detalles.*.calorias' => 'nullable|numeric|min:0',
            'detalles.*.proteinas' => 'nullable|numeric|min:0',
            'detalles.*.carbohidratos' => 'nullable|numeric|min:0',
            'detalles.*.grasas' => 'nullable|numeric|min:0',
            'detalles.*.observacion' => 'nullable|string',
        ];
    }
}
