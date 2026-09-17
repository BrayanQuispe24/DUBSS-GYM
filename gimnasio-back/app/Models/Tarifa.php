<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tarifa extends Model
{
    use HasFactory;

    protected $table = 'tarifas';

    protected $fillable = [
        'nombre',
        'precio',
        'fecha_inicio',
        'fecha_fin',
        'estado',
    ];

    public function planes(): HasMany
    {
        return $this->hasMany(Plan::class, 'id_tarifa');
    }

    public function boletasInscripcion(): HasMany
    {
        return $this->hasMany(BoletaInscripcion::class, 'id_tarifa');
    }
}
