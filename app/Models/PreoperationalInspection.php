<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PreoperationalInspection extends Model
{
    protected $fillable = [
        'vehicle_id', 'inspector_id', 'result', 'observations', 'odometer', 'inspected_at',
    ];

    protected $casts = [
        'inspected_at' => 'datetime',
    ];

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function inspector(): BelongsTo
    {
        return $this->belongsTo(User::class, 'inspector_id');
    }

    public function responses(): HasMany
    {
        return $this->hasMany(PreoperationalResponse::class, 'inspection_id');
    }
}
