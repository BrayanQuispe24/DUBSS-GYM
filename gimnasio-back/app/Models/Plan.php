<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Plan extends Model
{
    use HasFactory;

    protected $table = 'planes';

    protected $fillable = [
        'nombre',
        'descripcion',
        'duracion_dias',
        'estado',
        'id_tarifa',
    ];

    public function tarifa(): BelongsTo
    {
        return $this->belongsTo(Tarifa::class, 'id_tarifa');
    }
}
