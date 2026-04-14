<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ─── Empresa demo ────────────────────────────────────────────────
        $company = Company::firstOrCreate(
            ['nit' => '900123456-1'],
            [
                'name'      => 'Transportes Demo S.A.S.',
                'email'     => 'admin@demo.com',
                'phone'     => '3001234567',
                'address'   => 'Calle 100 # 15-20, Bogotá',
                'is_active' => true,
            ]
        );

        // ─── Superadmin (acceso global) ──────────────────────────────────
        User::firstOrCreate(
            ['email' => 'superadmin@vecto.app'],
            [
                'name'     => 'Super Admin',
                'role'     => UserRole::Superadmin,
                'password' => Hash::make('password'),
            ]
        );

        // ─── Admin de empresa ────────────────────────────────────────────
        User::firstOrCreate(
            ['email' => 'admin@demo.com'],
            [
                'company_id' => $company->id,
                'name'       => 'Admin Demo',
                'role'       => UserRole::CompanyAdmin,
                'position'   => 'Gerente de Flota',
                'password'   => Hash::make('password'),
            ]
        );

        // ─── Operador ────────────────────────────────────────────────────
        User::firstOrCreate(
            ['email' => 'operador@demo.com'],
            [
                'company_id' => $company->id,
                'name'       => 'Juan Pérez',
                'role'       => UserRole::Operator,
                'position'   => 'Conductor',
                'password'   => Hash::make('password'),
            ]
        );
    }
}
