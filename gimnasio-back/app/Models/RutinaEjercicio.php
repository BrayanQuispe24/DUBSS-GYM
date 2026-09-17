<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RutinaEjercicio extends Model
{
    use HasFactory;

    protected $table = 'rutina_ejercicio';

    protected $fillable = [
        'series',
        'repeticiones',
        'peso',
        'duracion_segundos',
        'descanso_segundos',
        'orden',
        'observacion',
        'id_ejercicio',
        'id_rutina',
    ];

    public function ejercicio(): BelongsTo
    {
        return $this->belongsTo(Ejercicio::class, 'id_ejercicio');
    }

    public function rutina(): BelongsTo
    {
        return $this->belongsTo(Rutina::class, 'id_rutina');
    }
}
