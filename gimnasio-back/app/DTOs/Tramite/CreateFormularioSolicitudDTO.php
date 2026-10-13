<?php

namespace App\DTOs\Tramite;

use App\Http\Requests\Tramite\CreateFormularioSolicitudRequest;

readonly class CreateFormularioSolicitudDTO
{
    public function __construct(
        public string $numeroFormulario,
        public int $idDisciplina,
        public int $idUsuario,
        public ?int $idDisciplinaHorario = null,
        public ?int $idPlan = null,
        public string $estado = 'pendiente',
        public ?string $fechaRegistro = null,
        public ?string $facultadCarrera = null,
        public ?string $domicilio = null,
        public ?string $celular = null,
        public ?string $sexo = null,
        public ?string $grupoSanguineo = null,
        public ?string $fechaNacimiento = null,
        public ?float $peso = null,
        public ?float $altura = null,
        public ?array $antecedentes = null,
    ) {}

    public static function fromRequest(CreateFormularioSolicitudRequest $request): self
    {
        return new self(
            numeroFormulario: $request->validated('numero_formulario'),
            idDisciplina: (int) $request->validated('id_disciplina'),
            idUsuario: (int) $request->validated('id_usuario'),
            idDisciplinaHorario: $request->validated('id_disciplina_horario') ? (int) $request->validated('id_disciplina_horario') : null,
            idPlan: $request->validated('id_plan') ? (int) $request->validated('id_plan') : null,
            estado: $request->validated('estado', 'pendiente'),
            fechaRegistro: $request->validated('fecha_registro'),
            facultadCarrera: $request->validated('facultad_carrera'),
            domicilio: $request->validated('domicilio'),
            celular: $request->validated('celular'),
            sexo: $request->validated('sexo'),
            grupoSanguineo: $request->validated('grupo_sanguineo'),
            fechaNacimiento: $request->validated('fecha_nacimiento'),
            peso: $request->validated('peso') ? (float) $request->validated('peso') : null,
            altura: $request->validated('altura') ? (float) $request->validated('altura') : null,
            antecedentes: $request->validated('antecedentes'),
        );
    }
}
