<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Historial extends Model
{
    use HasFactory;

    protected $table = 'historiales';

    protected $fillable = [
        'fecha_apertura',
        'observaciones_generales',
        'grupo_sanguineo',
        'sexo',
        'fecha_nacimiento',
        'domicilio',
        'celular_emergencia',
        'id_usuario',
    ];

    protected $appends = ['observaciones'];

    public function getObservacionesAttribute(): ?string
    {
        return $this->observaciones_generales;
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuario');
    }

    public function detalles(): HasMany
    {
        return $this->hasMany(DetalleHistorial::class, 'id_historial');
    }

    public function antecedentes(): HasMany
    {
        return $this->hasMany(Antecedente::class, 'id_historial');
    }
}
