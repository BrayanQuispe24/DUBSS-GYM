<?php

namespace App\Http\Requests\Auth;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class AuthRegisterRequest extends FormRequest
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
            'codigo' => ['nullable', 'string', 'max:20'],
            'nombre' => ['required', 'string', 'max:255'],
            'apellido' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:usuarios,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'ci' => ['nullable', 'string', 'max:20'],
            'celular' => ['nullable', 'string', 'max:20'],
            'tipo_usuario' => ['nullable', 'string', 'max:50'],
            'acepta_terminos' => 'required|accepted',
            'rol' => ['required', 'string', 'exists:roles,nombre'],
        ];
    }

    public function messages(): array
    {
        return [
            'codigo.max' => 'El código debe tener como máximo 20 caracteres.',
            'nombre.required' => 'El nombre es obligatorio.',
            'nombre.max' => 'El nombre debe tener como máximo 255 caracteres.',
            'apellido.required' => 'El apellido es obligatorio.',
            'apellido.max' => 'El apellido debe tener como máximo 255 caracteres.',
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'El correo electrónico debe ser válido.',
            'email.max' => 'El correo electrónico debe tener como máximo 255 caracteres.',
            'email.unique' => 'El correo electrónico ya existe.',
            'password.required' => 'La contraseña es obligatoria.',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
            'password.confirmed' => 'La contraseña no coincide con la confirmación.',
            'ci.max' => 'El CI debe tener como máximo 20 caracteres.',
            'celular.max' => 'El celular debe tener como máximo 20 caracteres.',
            'tipo_usuario.max' => 'El tipo de usuario debe tener como máximo 50 caracteres.',
            'acepta_terminos.required' => 'Debes aceptar los términos y condiciones.',
            'acepta_terminos.accepted' => 'Debes aceptar los términos y condiciones.',
            'rol.required' => 'El rol es obligatorio.',
            'rol.exists' => 'El rol seleccionado no existe.',
        ];
    }

    public function attributes(): array
    {
        return [
            'codigo' => 'codigo',
            'nombre' => 'nombre',
            'apellido' => 'apellido',
            'email' => 'email',
            'password' => 'password',
            'ci' => 'ci',
            'celular' => 'celular',
            'acepta_terminos' => 'acepta_terminos',
            'tipo_usuario' => 'tipo_usuario',
            'rol' => 'rol',
        ];
    }
}
