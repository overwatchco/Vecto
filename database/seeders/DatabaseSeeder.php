<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            CompanySeeder::class,       // empresas + usuarios (todos los roles)
            VehicleSeeder::class,       // vehículos + ubicaciones GPS
            MaintenanceSeeder::class,   // mantenimientos + costos automáticos
            PreoperationalSeeder::class,// checklist + inspecciones con respuestas
            MaterialSeeder::class,      // inventario + movimientos entrada/salida
            FinancialSeeder::class,     // costos, ingresos, contratos, bases
        ]);
    }
}
