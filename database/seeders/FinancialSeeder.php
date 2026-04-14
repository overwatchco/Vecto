<?php

namespace Database\Seeders;

use App\Models\Base;
use App\Models\Company;
use App\Models\Contract;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\VehicleCost;
use App\Models\VehicleRevenue;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class FinancialSeeder extends Seeder
{
    public function run(): void
    {
        $empresa1 = Company::where('nit', '900123456-1')->first();
        $empresa2 = Company::where('nit', '800987654-2')->first();
        $admin1   = User::where('email', 'admin@andinos.com')->first();
        $admin2   = User::where('email', 'admin@logcaribe.com')->first();

        // ── Costos adicionales (combustible, seguros, peajes) ────────────────
        $costos = [
            ['plate' => 'SRK-521', 'cat' => 'fuel',      'desc' => 'Recarga combustible ACPM — 80 lt', 'amount' => 336000,  'days_ago' => 1],
            ['plate' => 'SRK-521', 'cat' => 'fuel',      'desc' => 'Recarga combustible ACPM — 60 lt', 'amount' => 252000,  'days_ago' => 8],
            ['plate' => 'SRK-521', 'cat' => 'insurance', 'desc' => 'Cuota póliza todo riesgo — junio',  'amount' => 485000,  'days_ago' => 15],
            ['plate' => 'SRK-521', 'cat' => 'tolls',     'desc' => 'Peajes Bogotá-Villavicencio x3',    'amount' => 47400,   'days_ago' => 2],

            ['plate' => 'TXL-874', 'cat' => 'fuel',      'desc' => 'Recarga combustible ACPM — 100 lt','amount' => 420000,  'days_ago' => 1],
            ['plate' => 'TXL-874', 'cat' => 'fuel',      'desc' => 'Recarga combustible ACPM — 90 lt', 'amount' => 378000,  'days_ago' => 6],
            ['plate' => 'TXL-874', 'cat' => 'taxes',     'desc' => 'Impuesto rodamiento 2026',          'amount' => 640000,  'days_ago' => 30],

            ['plate' => 'VZQ-165', 'cat' => 'fuel',      'desc' => 'Recarga gasolina — 45 lt',         'amount' => 234000,  'days_ago' => 2],
            ['plate' => 'VZQ-165', 'cat' => 'insurance', 'desc' => 'Cuota póliza todo riesgo — junio',  'amount' => 310000,  'days_ago' => 15],

            ['plate' => 'XCM-441', 'cat' => 'fuel',      'desc' => 'Recarga combustible ACPM — 120 lt','amount' => 504000,  'days_ago' => 1],
            ['plate' => 'XCM-441', 'cat' => 'insurance', 'desc' => 'Cuota póliza flota — junio',        'amount' => 520000,  'days_ago' => 15],
            ['plate' => 'YDN-558', 'cat' => 'fuel',      'desc' => 'Recarga gasolina — 50 lt',         'amount' => 260000,  'days_ago' => 3],
        ];

        foreach ($costos as $c) {
            $vehicle = Vehicle::where('plate', $c['plate'])->first();
            $admin   = $vehicle && $vehicle->company_id === $empresa1->id ? $admin1 : $admin2;
            if (! $vehicle) continue;

            VehicleCost::firstOrCreate(
                ['vehicle_id' => $vehicle->id, 'description' => $c['desc']],
                [
                    'registered_by' => $admin?->id,
                    'category'      => $c['cat'],
                    'amount'        => $c['amount'],
                    'date'          => Carbon::now()->subDays($c['days_ago'])->toDateString(),
                ]
            );
        }

        // ── Contratos ────────────────────────────────────────────────────────
        $contrato1 = Contract::firstOrCreate(
            ['company_id' => $empresa1->id, 'code' => 'CT-2026-001'],
            [
                'client'       => 'Constructora Colpatria S.A.',
                'service_type' => 'Transporte de materiales de construcción',
                'rate'         => 4500000,
                'rate_unit'    => 'mes',
                'start_date'   => Carbon::now()->startOfYear()->toDateString(),
                'end_date'     => Carbon::now()->endOfYear()->toDateString(),
                'conditions'   => 'Servicio exclusivo lunes a sábado. Incluye 2 conductores y 3 viajes diarios mínimo.',
                'status'       => 'active',
            ]
        );

        $contrato2 = Contract::firstOrCreate(
            ['company_id' => $empresa1->id, 'code' => 'CT-2026-002'],
            [
                'client'       => 'Éxito Grupo Nacional',
                'service_type' => 'Distribución de mercancía — zona norte',
                'rate'         => 850000,
                'rate_unit'    => 'día',
                'start_date'   => Carbon::now()->subMonths(3)->toDateString(),
                'end_date'     => Carbon::now()->addMonths(3)->toDateString(),
                'conditions'   => 'Entrega puerta a puerta. Ruta fija Bogotá norte. Refrigeración no requerida.',
                'status'       => 'active',
            ]
        );

        $contrato3 = Contract::firstOrCreate(
            ['company_id' => $empresa1->id, 'code' => 'CT-2025-010'],
            [
                'client'       => 'Cementos Argos',
                'service_type' => 'Transporte a granel',
                'rate'         => 3200000,
                'rate_unit'    => 'mes',
                'start_date'   => Carbon::now()->subYear()->toDateString(),
                'end_date'     => Carbon::now()->subMonths(1)->toDateString(),
                'status'       => 'expired',
            ]
        );

        $contrato4 = Contract::firstOrCreate(
            ['company_id' => $empresa2->id, 'code' => 'CT-2026-001'],
            [
                'client'       => 'Puerto de Barranquilla — SPRB',
                'service_type' => 'Transporte de contenedores zona portuaria',
                'rate'         => 6800000,
                'rate_unit'    => 'mes',
                'start_date'   => Carbon::now()->subMonths(2)->toDateString(),
                'end_date'     => Carbon::now()->addMonths(10)->toDateString(),
                'status'       => 'active',
            ]
        );

        // Asignar vehículos a contratos
        $asignaciones = [
            [$contrato1, 'SRK-521'],
            [$contrato1, 'TXL-874'],
            [$contrato2, 'VZQ-165'],
            [$contrato4, 'XCM-441'],
            [$contrato4, 'YDN-558'],
        ];

        foreach ($asignaciones as [$contrato, $plate]) {
            $vehicle = Vehicle::where('plate', $plate)->first();
            if (! $vehicle) continue;
            if (! $contrato->vehicles()->where('vehicle_id', $vehicle->id)->exists()) {
                $contrato->vehicles()->attach($vehicle->id, [
                    'assigned_at' => $contrato->start_date,
                ]);
            }
        }

        // ── Ingresos ─────────────────────────────────────────────────────────
        $ingresos = [
            ['plate' => 'SRK-521', 'contract' => $contrato1, 'desc' => 'Servicio transporte — semana 1 abril', 'amount' => 1125000, 'days_ago' => 14],
            ['plate' => 'SRK-521', 'contract' => $contrato1, 'desc' => 'Servicio transporte — semana 2 abril', 'amount' => 1125000, 'days_ago' => 7],
            ['plate' => 'SRK-521', 'contract' => $contrato1, 'desc' => 'Servicio transporte — semana 3 abril', 'amount' => 1125000, 'days_ago' => 0],
            ['plate' => 'TXL-874', 'contract' => $contrato1, 'desc' => 'Servicio transporte — semana 1 abril', 'amount' => 1125000, 'days_ago' => 14],
            ['plate' => 'TXL-874', 'contract' => $contrato1, 'desc' => 'Servicio transporte — semana 2 abril', 'amount' => 1125000, 'days_ago' => 7],
            ['plate' => 'VZQ-165', 'contract' => $contrato2, 'desc' => 'Distribución zona norte — 12 días',    'amount' => 10200000,'days_ago' => 5],
            ['plate' => 'XCM-441', 'contract' => $contrato4, 'desc' => 'Transporte contenedores — quincena 1','amount' => 3400000, 'days_ago' => 16],
            ['plate' => 'XCM-441', 'contract' => $contrato4, 'desc' => 'Transporte contenedores — quincena 2','amount' => 3400000, 'days_ago' => 1],
            ['plate' => 'YDN-558', 'contract' => $contrato4, 'desc' => 'Apoyo logístico zona portuaria',       'amount' => 1800000, 'days_ago' => 5],
        ];

        foreach ($ingresos as $i) {
            $vehicle = Vehicle::where('plate', $i['plate'])->first();
            $admin   = $vehicle && $vehicle->company_id === $empresa1->id ? $admin1 : $admin2;
            if (! $vehicle) continue;

            VehicleRevenue::firstOrCreate(
                ['vehicle_id' => $vehicle->id, 'description' => $i['desc']],
                [
                    'contract_id'   => $i['contract']?->id,
                    'registered_by' => $admin?->id,
                    'amount'        => $i['amount'],
                    'date'          => Carbon::now()->subDays($i['days_ago'])->toDateString(),
                ]
            );
        }

        // ── Bases operativas ─────────────────────────────────────────────────
        $base1 = Base::firstOrCreate(
            ['company_id' => $empresa1->id, 'name' => 'Base Norte — Bogotá'],
            [
                'address'   => 'Calle 170 # 54-30, Bogotá',
                'latitude'  => 4.7856,
                'longitude' => -74.0498,
                'capacity'  => 8,
                'is_active' => true,
            ]
        );

        $base2 = Base::firstOrCreate(
            ['company_id' => $empresa1->id, 'name' => 'Bodega Sur — Soacha'],
            [
                'address'   => 'Autopista Sur Km 22, Soacha, Cundinamarca',
                'latitude'  => 4.5798,
                'longitude' => -74.2174,
                'capacity'  => 5,
                'is_active' => true,
            ]
        );

        $base3 = Base::firstOrCreate(
            ['company_id' => $empresa2->id, 'name' => 'Terminal Portuario'],
            [
                'address'   => 'Vía 40 Km 1, Barranquilla',
                'latitude'  => 10.9985,
                'longitude' => -74.7915,
                'capacity'  => 4,
                'is_active' => true,
            ]
        );

        // Asignar vehículos a bases
        $bases = [
            [$base1, 'SRK-521'],
            [$base1, 'TXL-874'],
            [$base1, 'VZQ-165'],
            [$base2, 'UYP-302'],
            [$base2, 'WBN-739'],
            [$base3, 'XCM-441'],
            [$base3, 'YDN-558'],
        ];

        foreach ($bases as [$base, $plate]) {
            $vehicle = Vehicle::where('plate', $plate)->first();
            if (! $vehicle) continue;
            if (! $base->vehicles()->where('vehicle_id', $vehicle->id)->exists()) {
                $base->vehicles()->attach($vehicle->id, [
                    'assigned_at' => Carbon::now()->subMonths(rand(1, 6))->toDateString(),
                ]);
            }
        }

        // Asignar operadores a bases
        $ops = User::whereIn('email', [
            'jperez@andinos.com', 'lgomez@andinos.com', 'mtorres@andinos.com',
        ])->get();

        foreach ($ops as $op) {
            if (! $base1->operators()->where('user_id', $op->id)->exists()) {
                $base1->operators()->attach($op->id, [
                    'assigned_at' => Carbon::now()->subMonths(2)->toDateString(),
                ]);
            }
        }

        $op4 = User::where('email', 'avargas@logcaribe.com')->first();
        if ($op4 && ! $base3->operators()->where('user_id', $op4->id)->exists()) {
            $base3->operators()->attach($op4->id, [
                'assigned_at' => Carbon::now()->subMonths(2)->toDateString(),
            ]);
        }
    }
}
