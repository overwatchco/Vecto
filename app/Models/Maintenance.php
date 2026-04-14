<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Maintenance extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'vehicle_id', 'responsible_id', 'type', 'date', 'description',
        'cost', 'provider', 'next_maintenance_date', 'next_maintenance_km',
        'status', 'notes',
    ];

    protected $casts = [
        'date'                  => 'date',
        'next_maintenance_date' => 'date',
        'cost'                  => 'decimal:2',
    ];

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function responsible(): BelongsTo
    {
        return $this->belongsTo(User::class, 'responsible_id');
    }

    public function materialMovements(): HasMany
    {
        return $this->hasMany(MaterialMovement::class);
    }

    public function costs(): HasMany
    {
        return $this->hasMany(VehicleCost::class);
    }
}
