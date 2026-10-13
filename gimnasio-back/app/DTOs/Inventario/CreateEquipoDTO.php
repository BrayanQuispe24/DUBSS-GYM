<?php

namespace App\DTOs\Inventario;

use App\Http\Requests\Inventario\CreateEquipoRequest;
use Illuminate\Support\Facades\Storage;

readonly class CreateEquipoDTO
{
    public function __construct(
        public string $codigo,
        public string $nombre,
        public ?string $modelo = null,
        public ?string $fechaAdquisicion = null,
        public ?float $precioCompra = null,
        public bool $estado = true,
        public int $cantidad = 0,
        public ?int $idAmbiente = null,
        public ?int $idMarca = null,
        public ?int $idTipoEquipo = null,
        public ?string $imagenUrl = null,
    ) {}

    public static function fromRequest(CreateEquipoRequest $request): self
    {
        $rawEstado = $request->validated('estado');
        $estadoBool = true;

        if ($rawEstado !== null) {
            if (is_bool($rawEstado)) {
                $estadoBool = $rawEstado;
            } elseif (is_numeric($rawEstado)) {
                $estadoBool = (bool) $rawEstado;
            } elseif (is_string($rawEstado)) {
                $estadoBool = ! in_array(strtolower($rawEstado), ['baja', 'dado de baja', 'mantenimiento', 'inactivo', 'false', '0']);
            }
        }

        $imagenUrl = $request->validated('imagen_url');
        if ($request->hasFile('imagen')) {
            $path = $request->file('imagen')->store('equipos', 'public');
            $imagenUrl = url(Storage::url($path));
        }

        return new self(
            codigo: $request->validated('codigo'),
            nombre: $request->validated('nombre'),
            modelo: $request->validated('modelo'),
            fechaAdquisicion: $request->validated('fecha_adquisicion'),
            precioCompra: $request->validated('precio_compra') !== null ? (float) $request->validated('precio_compra') : null,
            estado: $estadoBool,
            cantidad: $request->validated('cantidad') !== null ? (int) $request->validated('cantidad') : 0,
            idAmbiente: $request->validated('id_ambiente') !== null ? (int) $request->validated('id_ambiente') : null,
            idMarca: $request->validated('id_marca') !== null ? (int) $request->validated('id_marca') : null,
            idTipoEquipo: $request->validated('id_tipo_equipo') !== null ? (int) $request->validated('id_tipo_equipo') : null,
            imagenUrl: $imagenUrl,
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'codigo' => $this->codigo,
            'nombre' => $this->nombre,
            'modelo' => $this->modelo,
            'fecha_adquisicion' => $this->fechaAdquisicion,
            'precio_compra' => $this->precioCompra,
            'estado' => $this->estado,
            'cantidad' => $this->cantidad,
            'id_ambiente' => $this->idAmbiente,
            'id_marca' => $this->idMarca,
            'id_tipo_equipo' => $this->idTipoEquipo,
            'imagen_url' => $this->imagenUrl,
        ], fn ($val) => $val !== null);
    }
}
