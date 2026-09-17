<?php

namespace App\Http\Requests\Documento;

use Illuminate\Foundation\Http\FormRequest;

class CreateDocumentoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id_tipo_documento' => 'required|exists:tipo_documentos,id',
            'archivo' => 'required|file|mimes:pdf|max:10240',
        ];
    }
}
