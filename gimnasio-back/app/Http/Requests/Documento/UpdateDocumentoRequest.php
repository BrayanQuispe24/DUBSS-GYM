<?php

namespace App\Http\Requests\Documento;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDocumentoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id' => 'required|exists:documentos,id',
            'id_tipo_documento' => 'nullable|exists:tipo_documentos,id',
            'archivo' => 'nullable|file|mimes:pdf|max:10240',
        ];
    }
}
