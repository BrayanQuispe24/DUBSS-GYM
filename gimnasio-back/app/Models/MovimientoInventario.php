<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MovimientoInventario extends Model
{
    use HasFactory;

    protected $table = 'movimiento_inventario';

    protected $fillable = [
        'fecha_hora',
        'motivo',
        'observacion',
        'cantidad',
        'id_tipo_movimiento',
        'id_equipo',
        'id_usuario',
    ];

    public function tipoMovimiento(): BelongsTo
    {
        return $this->belongsTo(TipoMovimiento::class, 'id_tipo_movimiento');
    }

    public function equipo(): BelongsTo
    {
        return $this->belongsTo(Equipo::class, 'id_equipo');
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuario');
    }
}
