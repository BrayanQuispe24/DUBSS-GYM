<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GrupoMuscular extends Model
{
    use HasFactory;

    protected $table = 'grupo_muscular';

    protected $fillable = [
        'nombre',
        'descripcion',
    ];

    public function ejercicioGrupoMusculares(): HasMany
    {
        return $this->hasMany(EjercicioGrupoMuscular::class, 'id_grupo_muscular');
    }
}
