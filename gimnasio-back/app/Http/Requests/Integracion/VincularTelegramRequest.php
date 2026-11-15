<?php

namespace App\Http\Requests\Integracion;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class VincularTelegramRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'token' => 'required|string|max:64',
            'telegram_chat_id' => 'required|string|max:50',
            'telegram_user_id' => 'nullable|string|max:50',
        ];
    }

    public function messages(): array
    {
        return [
            'token.required' => 'El token de vinculación es obligatorio.',
            'telegram_chat_id.required' => 'El telegram_chat_id es obligatorio.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        // En caso de faltar campos obligatorios, devolver respuesta JSON controlada compatible con n8n
        $payload = json_encode([
            'success' => false,
            'telegram_chat_id' => $this->input('telegram_chat_id'),
            'mensaje' => $validator->errors()->first(),
            'errors' => $validator->errors(),
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        header('Content-Type: application/json; charset=utf-8');
        header('Content-Length: ' . strlen($payload));
        header('Connection: close');
        echo $payload;
        exit;
    }
}

