<?php

namespace App\Http\Requests\Usuario;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CreateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nombre' => 'required|string|max:100',
            'apellido' => 'required|string|max:100',
            'email' => 'required|email|unique:usuarios,email',
            'password' => 'required|string|min:6',
            'rol' => 'required|string|in:administrador,recepcionista,instructor,cliente,Administrador,Recepcionista,Instructor,Cliente',
            'codigo' => 'nullable|string|max:20',
            'ci' => 'nullable|string|max:20',
            'celular' => 'nullable|string|max:20',
            'tipo_usuario' => 'nullable|string|in:estudiante,docente,administrativo,particular',
            'estado' => 'nullable|in:activo,suspendido,1,0',
            'id_disciplina' => 'nullable|exists:disciplinas,id',
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre es obligatorio.',
            'nombre.max' => 'El nombre debe tener como máximo 100 caracteres.',
            'apellido.required' => 'El apellido es obligatorio.',
            'apellido.max' => 'El apellido debe tener como máximo 100 caracteres.',
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'El correo electrónico debe ser válido.',
            'email.unique' => 'El correo electrónico ya existe.',
            'password.required' => 'La contraseña es obligatoria.',
            'password.min' => 'La contraseña debe tener al menos 6 caracteres.',
            'rol.required' => 'El rol es obligatorio.',
            'rol.in' => 'El rol seleccionado no es válido.',
            'codigo.max' => 'El código debe tener como máximo 20 caracteres.',
            'ci.max' => 'El CI debe tener como máximo 20 caracteres.',
            'celular.max' => 'El celular debe tener como máximo 20 caracteres.',
            'tipo_usuario.in' => 'El tipo de usuario seleccionado no es válido.',
            'estado.in' => 'El estado seleccionado no es válido.',
        ];
    }

    public function attributes(): array
    {
        return [
            'nombre' => 'nombre',
            'apellido' => 'apellido',
            'email' => 'email',
            'password' => 'password',
            'rol' => 'rol',
            'codigo' => 'codigo',
            'ci' => 'ci',
            'celular' => 'celular',
            'tipo_usuario' => 'tipo_usuario',
            'estado' => 'estado',
        ];
    }
}
