<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vehicle extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'company_id', 'plate', 'type', 'brand', 'model', 'year',
        'color', 'vin', 'status', 'photo', 'notes',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function statusHistory(): HasMany
    {
        return $this->hasMany(VehicleStatusHistory::class);
    }

    public function maintenances(): HasMany
    {
        return $this->hasMany(Maintenance::class);
    }

    public function locations(): HasMany
    {
        return $this->hasMany(VehicleLocation::class);
    }

    public function lastLocation(): HasOne
    {
        return $this->hasOne(VehicleLocation::class)->latestOfMany('recorded_at');
    }

    public function preoperationalInspections(): HasMany
    {
        return $this->hasMany(PreoperationalInspection::class);
    }

    public function costs(): HasMany
    {
        return $this->hasMany(VehicleCost::class);
    }

    public function revenues(): HasMany
    {
        return $this->hasMany(VehicleRevenue::class);
    }

    public function contracts(): BelongsToMany
    {
        return $this->belongsToMany(Contract::class, 'contract_vehicle')
            ->withPivot(['assigned_at', 'removed_at'])
            ->withTimestamps();
    }

    public function bases(): BelongsToMany
    {
        return $this->belongsToMany(Base::class, 'base_vehicle')
            ->withPivot(['assigned_at', 'removed_at'])
            ->withTimestamps();
    }

    public function getNextMaintenanceAttribute(): ?Maintenance
    {
        return $this->maintenances()
            ->where('status', 'scheduled')
            ->orderBy('date')
            ->first();
    }
}
