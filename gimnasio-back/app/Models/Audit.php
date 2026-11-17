<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OwenIt\Auditing\Models\Audit as BaseAudit;

class Audit extends BaseAudit
{
    protected $table = 'audits';

    protected $casts = [
        'old_values' => 'json',
        'new_values' => 'json',
        'auditable_id' => 'integer',
        'user_id' => 'integer',
    ];

    /**
     * Relationship to the user who performed the action.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'user_id');
    }
}

