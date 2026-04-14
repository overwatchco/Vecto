<?php

namespace App\Models;

use App\Enums\UserRole;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    protected $fillable = [
        'company_id',
        'name',
        'role',
        'email',
        'phone',
        'position',
        'password',
    ];

    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at'       => 'datetime',
            'password'                => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'role'                    => UserRole::class,
        ];
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === UserRole::Superadmin;
    }

    public function isCompanyAdmin(): bool
    {
        return $this->role === UserRole::CompanyAdmin;
    }

    public function isOperator(): bool
    {
        return $this->role === UserRole::Operator;
    }

    /** Backward-compat alias — admins are superadmins or company admins */
    public function isAdmin(): bool
    {
        return $this->isSuperAdmin() || $this->isCompanyAdmin();
    }

    /** @deprecated use isOperator() */
    public function isEmployee(): bool
    {
        return $this->isOperator();
    }

    public function getDashboardRoute(): string
    {
        return match ($this->role) {
            UserRole::Superadmin   => '/admin/dashboard',
            UserRole::CompanyAdmin => '/empresa/dashboard',
            default                => '/dashboard',
        };
    }
}
