<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'nit',
        'email',
        'phone',
        'address',
        'logo',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function admins(): HasMany
    {
        return $this->hasMany(User::class)->where('role', 'company_admin');
    }

    public function operators(): HasMany
    {
        return $this->hasMany(User::class)->where('role', 'operator');
    }

    public function vehicles(): HasMany
    {
        return $this->hasMany(Vehicle::class);
    }

    public function contracts(): HasMany
    {
        return $this->hasMany(Contract::class);
    }

    public function bases(): HasMany
    {
        return $this->hasMany(Base::class);
    }

    public function materials(): HasMany
    {
        return $this->hasMany(Material::class);
    }

    public function preoperationalItems(): HasMany
    {
        return $this->hasMany(PreoperationalItem::class);
    }
}
