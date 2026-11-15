<?php

namespace App\Http\Requests\Integracion;

use Illuminate\Foundation\Http\FormRequest;

class RegistrarNotificacionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'boleta_id' => 'required|integer|exists:boleta_inscripcion,id',
            'cliente_id' => 'required|integer|exists:usuarios,id',
            'fecha_vencimiento' => 'required|date',
            'dias_restantes' => 'required|integer',
            'canal' => 'required|string|max:30',
            'estado' => 'required|string|in:enviado,fallido',
            'telegram_message_id' => 'nullable',
            'error_motivo' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'boleta_id.required' => 'El campo boleta_id es obligatorio.',
            'boleta_id.exists' => 'La boleta_id no existe en el sistema.',
            'cliente_id.required' => 'El campo cliente_id es obligatorio.',
            'cliente_id.exists' => 'El cliente_id no existe en el sistema.',
            'estado.in' => 'El estado debe ser "enviado" o "fallido".',
        ];
    }
}

