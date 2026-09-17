<?php

namespace App\Actions\Inventario;

use App\DTOs\Inventario\CreateMovimientoInventarioDTO;
use App\Models\Equipo;
use App\Models\MovimientoInventario;
use App\Models\TipoMovimiento;
use App\Models\Usuario;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class CreateMovimientoInventarioAction
{
    public function execute(CreateMovimientoInventarioDTO $dto, Usuario $user): MovimientoInventario
    {
        return DB::transaction(function () use ($dto, $user) {
            $equipo = Equipo::findOrFail($dto->id_equipo);
            $tipoMovimiento = TipoMovimiento::findOrFail($dto->id_tipo_movimiento);
            $tipoNombre = mb_strtolower($tipoMovimiento->nombre);

            $cantidadAbs = abs($dto->cantidad);

            $esSalida = (bool) $tipoMovimiento->es_salida
                || $dto->cantidad < 0
                || str_contains($tipoNombre, 'salida')
                || str_contains($tipoNombre, 'egreso')
                || str_contains($tipoNombre, 'baja')
                || str_contains($tipoNombre, 'disminuir')
                || str_contains($tipoNombre, 'deterioro');

            if ($esSalida) {
                if ($equipo->cantidad < $cantidadAbs) {
                    throw new InvalidArgumentException("Stock insuficiente para realizar la salida. Stock actual: {$equipo->cantidad}");
                }
                $equipo->decrement('cantidad', $cantidadAbs);
            } else {
                $equipo->increment('cantidad', $cantidadAbs);
            }

            return MovimientoInventario::create([
                'fecha_hora' => now(),
                'motivo' => $dto->motivo,
                'observacion' => $dto->observacion,
                'cantidad' => $cantidadAbs,
                'id_tipo_movimiento' => $dto->id_tipo_movimiento,
                'id_equipo' => $dto->id_equipo,
                'id_usuario' => $user->id,
            ]);
        });
    }
}
