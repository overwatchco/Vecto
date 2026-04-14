<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VehicleLocation extends Model
{
    protected $fillable = [
        'vehicle_id', 'latitude', 'longitude', 'address', 'speed', 'heading', 'recorded_at',
    ];

    protected $casts = [
        'recorded_at' => 'datetime',
        'latitude'    => 'decimal:8',
        'longitude'   => 'decimal:8',
    ];

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }
}
