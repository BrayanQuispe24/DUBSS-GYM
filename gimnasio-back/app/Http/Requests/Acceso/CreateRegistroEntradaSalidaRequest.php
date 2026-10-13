<?php

namespace App\Http\Requests\Acceso;

use Illuminate\Foundation\Http\FormRequest;

class CreateRegistroEntradaSalidaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tipo' => 'required|string|in:entrada,salida',
            'id_usuario' => 'required|exists:usuarios,id',
            'id_boleta_inscripcion' => 'nullable|exists:boleta_inscripcion,id',
            'fecha_hora' => 'nullable|date',
        ];
    }
}
