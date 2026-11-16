<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EjercicioImagen extends Model
{
    use HasFactory;

    protected $table = 'ejercicio_imagenes';

    protected $fillable = [
        'id_ejercicio',
        'path_imagen',
        'titulo',
        'descripcion',
        'orden',
    ];

    public function getPathImagenAttribute(?string $value): string
    {
        if (empty($value)) {
            return '';
        }

        return preg_replace('#^https?://localhost(:\d+)?#i', '', $value);
    }

    public function ejercicio(): BelongsTo
    {
        return $this->belongsTo(Ejercicio::class, 'id_ejercicio');
    }
}
