<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Base extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'company_id', 'name', 'address', 'latitude', 'longitude', 'capacity', 'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'latitude'  => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function vehicles(): BelongsToMany
    {
        return $this->belongsToMany(Vehicle::class, 'base_vehicle')
            ->withPivot(['assigned_at', 'removed_at'])
            ->withTimestamps();
    }

    public function operators(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'base_user')
            ->withPivot(['assigned_at', 'removed_at'])
            ->withTimestamps();
    }
}
