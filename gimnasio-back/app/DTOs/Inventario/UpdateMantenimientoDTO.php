<?php

namespace App\DTOs\Inventario;

use App\Http\Requests\Inventario\UpdateMantenimientoRequest;

readonly class UpdateMantenimientoDTO
{
    public function __construct(
        public ?string $tipo = null,
        public ?string $fechaInicio = null,
        public ?int $idEquipo = null,
        public ?int $cantidad = null,
        public ?string $fechaFin = null,
        public ?string $descripcion = null,
        public ?float $costo = null,
        public ?bool $estado = null,
        public ?string $proximoMantenimiento = null,
        public ?string $observacion = null,
    ) {}

    public static function fromRequest(UpdateMantenimientoRequest $request): self
    {
        $rawEstado = $request->validated('estado');
        $boolEstado = null;

        if ($rawEstado !== null) {
            if (is_bool($rawEstado)) {
                $boolEstado = $rawEstado;
            } elseif (is_numeric($rawEstado)) {
                $boolEstado = (int) $rawEstado === 1;
            } else {
                $str = strtolower((string) $rawEstado);
                $boolEstado = !in_array($str, ['completado', 'inactivo', 'finalizado', 'false', '0']);
            }
        }

        $rawCant = $request->validated('cantidad');
        $cant = $rawCant !== null ? (int) $rawCant : null;

        return new self(
            tipo: $request->validated('tipo'),
            fechaInicio: $request->validated('fecha_inicio'),
            idEquipo: $request->validated('id_equipo') ? (int) $request->validated('id_equipo') : null,
            cantidad: $cant,
            fechaFin: $request->validated('fecha_fin'),
            descripcion: $request->validated('descripcion'),
            costo: $request->validated('costo') !== null ? (float) $request->validated('costo') : null,
            estado: $boolEstado,
            proximoMantenimiento: $request->validated('proximo_mantenimiento'),
            observacion: $request->validated('observacion'),
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'tipo' => $this->tipo,
            'fecha_inicio' => $this->fechaInicio,
            'id_equipo' => $this->idEquipo,
            'cantidad' => $this->cantidad,
            'fecha_fin' => $this->fechaFin,
            'descripcion' => $this->descripcion,
            'costo' => $this->costo,
            'estado' => $this->estado,
            'proximo_mantenimiento' => $this->proximoMantenimiento,
            'observacion' => $this->observacion,
        ], fn ($val) => $val !== null);
    }
}
