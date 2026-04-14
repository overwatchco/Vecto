<?php

namespace App\Enums;

enum UserRole: string
{
    case Superadmin   = 'superadmin';
    case CompanyAdmin = 'company_admin';
    case Operator     = 'operator';

    public function label(): string
    {
        return match ($this) {
            self::Superadmin   => 'Superadministrador',
            self::CompanyAdmin => 'Administrador de Empresa',
            self::Operator     => 'Operador',
        };
    }

    public static function options(): array
    {
        return array_map(
            fn (self $role) => ['value' => $role->value, 'label' => $role->label()],
            self::cases()
        );
    }

    public static function companyOptions(): array
    {
        return array_map(
            fn (self $role) => ['value' => $role->value, 'label' => $role->label()],
            [self::CompanyAdmin, self::Operator]
        );
    }
}
