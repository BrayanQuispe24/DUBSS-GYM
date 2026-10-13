<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetalleHistorial extends Model
{
    use HasFactory;

    protected $table = 'detalle_historial';

    protected $fillable = [
        'peso',
        'altura',
        'imc',
        'porcentaje_grasa',
        'masa_muscular',
        'presion',
        'fecha_registro',
        'id_historial',
    ];

    protected function casts(): array
    {
        return [
            'fecha_registro' => 'date:Y-m-d',
        ];
    }

    public function historial(): BelongsTo
    {
        return $this->belongsTo(Historial::class, 'id_historial');
    }
}
