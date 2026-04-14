<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Contract extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'company_id', 'code', 'client', 'service_type', 'rate', 'rate_unit',
        'start_date', 'end_date', 'conditions', 'status',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date'   => 'date',
        'rate'       => 'decimal:2',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function vehicles(): BelongsToMany
    {
        return $this->belongsToMany(Vehicle::class, 'contract_vehicle')
            ->withPivot(['assigned_at', 'removed_at'])
            ->withTimestamps();
    }

    public function revenues(): HasMany
    {
        return $this->hasMany(VehicleRevenue::class);
    }
}
