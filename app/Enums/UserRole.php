<?php

namespace App\Enums;

enum UserRole: string
{
    case Admin    = 'admin';
    case Employee = 'employee';

    public function label(): string
    {
        return match ($this) {
            self::Admin    => 'Administrador',
            self::Employee => 'Empleado',
        };
    }

    public static function options(): array
    {
        return array_map(
            fn (self $role) => ['value' => $role->value, 'label' => $role->label()],
            self::cases()
        );
    }
}
