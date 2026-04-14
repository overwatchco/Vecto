<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MaterialMovement extends Model
{
    protected $fillable = [
        'material_id', 'user_id', 'maintenance_id', 'type', 'quantity', 'unit_cost', 'reason', 'date',
    ];

    protected $casts = [
        'date'      => 'date',
        'quantity'  => 'decimal:2',
        'unit_cost' => 'decimal:2',
    ];

    public function material(): BelongsTo
    {
        return $this->belongsTo(Material::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function maintenance(): BelongsTo
    {
        return $this->belongsTo(Maintenance::class);
    }
}
