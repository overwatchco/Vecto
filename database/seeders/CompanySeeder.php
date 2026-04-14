<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CompanySeeder extends Seeder
{
    public function run(): void
    {
        // ── Empresa 1 ───────────────────────────────────────────────────────
        $empresa1 = Company::firstOrCreate(
            ['nit' => '900123456-1'],
            [
                'name'      => 'Transportes Andinos S.A.S.',
                'email'     => 'operaciones@andinos.com',
                'phone'     => '6017001234',
                'address'   => 'Calle 80 # 68C-30, Bogotá',
                'is_active' => true,
            ]
        );

        // ── Empresa 2 ───────────────────────────────────────────────────────
        $empresa2 = Company::firstOrCreate(
            ['nit' => '800987654-2'],
            [
                'name'      => 'Logística del Caribe Ltda.',
                'email'     => 'flota@logcaribe.com',
                'phone'     => '6054321098',
                'address'   => 'Carrera 46 # 76-90, Barranquilla',
                'is_active' => true,
            ]
        );

        // ── Superadmin ──────────────────────────────────────────────────────
        User::firstOrCreate(
            ['email' => 'superadmin@vecto.app'],
            [
                'name'     => 'Super Admin VECTO',
                'role'     => UserRole::Superadmin,
                'password' => Hash::make('password'),
            ]
        );

        // ── Empresa 1 — Admin ───────────────────────────────────────────────
        User::firstOrCreate(
            ['email' => 'admin@andinos.com'],
            [
                'company_id' => $empresa1->id,
                'name'       => 'Carlos Mendoza',
                'role'       => UserRole::CompanyAdmin,
                'position'   => 'Gerente de Flota',
                'phone'      => '3101234567',
                'password'   => Hash::make('password'),
            ]
        );

        // ── Empresa 1 — Operadores ──────────────────────────────────────────
        $operadores1 = [
            ['name' => 'Juan Pérez',    'email' => 'jperez@andinos.com',    'position' => 'Conductor Senior'],
            ['name' => 'Luis Gómez',    'email' => 'lgomez@andinos.com',    'position' => 'Conductor'],
            ['name' => 'María Torres',  'email' => 'mtorres@andinos.com',   'position' => 'Conductora'],
            ['name' => 'Pedro Suárez',  'email' => 'psuarez@andinos.com',   'position' => 'Mecánico'],
        ];

        foreach ($operadores1 as $op) {
            User::firstOrCreate(
                ['email' => $op['email']],
                array_merge($op, [
                    'company_id' => $empresa1->id,
                    'role'       => UserRole::Operator,
                    'password'   => Hash::make('password'),
                ])
            );
        }

        // ── Empresa 2 — Admin ───────────────────────────────────────────────
        User::firstOrCreate(
            ['email' => 'admin@logcaribe.com'],
            [
                'company_id' => $empresa2->id,
                'name'       => 'Sofía Ramos',
                'role'       => UserRole::CompanyAdmin,
                'position'   => 'Directora de Operaciones',
                'phone'      => '3209876543',
                'password'   => Hash::make('password'),
            ]
        );

        // ── Empresa 2 — Operadores ──────────────────────────────────────────
        $operadores2 = [
            ['name' => 'Andrés Vargas',  'email' => 'avargas@logcaribe.com',  'position' => 'Conductor'],
            ['name' => 'Diana Castro',   'email' => 'dcastro@logcaribe.com',   'position' => 'Conductora'],
        ];

        foreach ($operadores2 as $op) {
            User::firstOrCreate(
                ['email' => $op['email']],
                array_merge($op, [
                    'company_id' => $empresa2->id,
                    'role'       => UserRole::Operator,
                    'password'   => Hash::make('password'),
                ])
            );
        }
    }
}
