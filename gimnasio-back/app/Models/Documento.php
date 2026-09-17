<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Documento extends Model
{
    use HasFactory;

    protected $table = 'documentos';

    protected $fillable = [
        'archivo_url',
        'id_tipo_documento',
        'id_usuario',
    ];

    protected $appends = ['ruta_archivo', 'titulo'];

    public function getRutaArchivoAttribute(): ?string
    {
        return $this->archivo_url;
    }

    public function getTituloAttribute(): string
    {
        $tipo = $this->tipoDocumento ? $this->tipoDocumento->nombre : 'Documento';
        return "{$tipo} #{$this->id}";
    }

    public function tipoDocumento(): BelongsTo
    {
        return $this->belongsTo(TipoDocumento::class, 'id_tipo_documento');
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuario');
    }
}
