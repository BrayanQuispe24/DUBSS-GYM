<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BoletaInscripcion extends Model
{
    use HasFactory;

    protected $table = 'boleta_inscripcion';

    protected $fillable = [
        'numero_boleta',
        'fecha_inscripcion',
        'fecha_inicio',
        'fecha_fin',
        'monto',
        'estado',
        'disciplina',
        'hora_inicio',
        'hora_salida',
        'id_tarifa',
        'id_usuario',
    ];

    public function tarifa(): BelongsTo
    {
        return $this->belongsTo(Tarifa::class, 'id_tarifa');
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuario');
    }

    public function registrosEntradaSalida(): HasMany
    {
        return $this->hasMany(RegistroEntradaSalida::class, 'id_boleta_inscripcion');
    }
}
