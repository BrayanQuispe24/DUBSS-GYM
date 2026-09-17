<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TipoEjercicio extends Model
{
    use HasFactory;

    protected $table = 'tipo_ejercicio';

    protected $fillable = [
        'nombre',
        'estado',
    ];

    public function ejercicios(): HasMany
    {
        return $this->hasMany(Ejercicio::class, 'id_tipo_ejercicio');
    }
}
