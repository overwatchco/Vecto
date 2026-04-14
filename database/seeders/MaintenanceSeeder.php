<?php

namespace Database\Seeders;

use App\Models\Maintenance;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\VehicleCost;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class MaintenanceSeeder extends Seeder
{
    public function run(): void
    {
        $admin1 = User::where('email', 'admin@andinos.com')->first();
        $mecan  = User::where('email', 'psuarez@andinos.com')->first();

        $mantenimientos = [
            // SRK-521
            [
                'plate'      => 'SRK-521',
                'type'       => 'preventive',
                'date'       => Carbon::now()->subDays(45),
                'description'=> 'Cambio de aceite y filtro — 10W-40, 5 litros',
                'cost'       => 280000,
                'provider'   => 'Taller Automotriz Bogotá',
                'status'     => 'completed',
                'next_date'  => Carbon::now()->addDays(45),
            ],
            [
                'plate'      => 'SRK-521',
                'type'       => 'preventive',
                'date'       => Carbon::now()->addDays(5),
                'description'=> 'Revisión de frenos y pastillas',
                'cost'       => 0,
                'provider'   => null,
                'status'     => 'scheduled',
                'next_date'  => null,
            ],
            // TXL-874
            [
                'plate'      => 'TXL-874',
                'type'       => 'corrective',
                'date'       => Carbon::now()->subDays(12),
                'description'=> 'Reparación de sistema eléctrico — corto en alternador',
                'cost'       => 950000,
                'provider'   => 'Electrónica Vehicular Torres',
                'status'     => 'completed',
                'next_date'  => null,
            ],
            [
                'plate'      => 'TXL-874',
                'type'       => 'preventive',
                'date'       => Carbon::now()->subDays(3),
                'description'=> 'Cambio de filtro de combustible y aire',
                'cost'       => 180000,
                'provider'   => 'Taller Automotriz Bogotá',
                'status'     => 'completed',
                'next_date'  => Carbon::now()->addDays(90),
            ],
            // UYP-302 (en mantenimiento)
            [
                'plate'      => 'UYP-302',
                'type'       => 'corrective',
                'date'       => Carbon::now()->subDays(2),
                'description'=> 'Cambio de amortiguadores delanteros y traseros',
                'cost'       => 1400000,
                'provider'   => 'Suspensiones del Norte',
                'status'     => 'in_progress',
                'next_date'  => null,
            ],
            // VZQ-165
            [
                'plate'      => 'VZQ-165',
                'type'       => 'preventive',
                'date'       => Carbon::now()->subDays(20),
                'description'=> 'Alineación, balanceo y rotación de llantas',
                'cost'       => 120000,
                'provider'   => 'Llantas Express',
                'status'     => 'completed',
                'next_date'  => Carbon::now()->addDays(60),
            ],
            // XCM-441
            [
                'plate'      => 'XCM-441',
                'type'       => 'preventive',
                'date'       => Carbon::now()->subDays(8),
                'description'=> 'Cambio de aceite y revisión general — 60.000 km',
                'cost'       => 350000,
                'provider'   => 'Multimarcas Barranquilla',
                'status'     => 'completed',
                'next_date'  => Carbon::now()->addDays(75),
            ],
        ];

        foreach ($mantenimientos as $m) {
            $vehicle = Vehicle::where('plate', $m['plate'])->first();
            if (! $vehicle) continue;

            $responsible = in_array($vehicle->company_id, [
                Vehicle::where('plate', 'SRK-521')->value('company_id'),
            ]) ? ($mecan ?? $admin1) : $admin1;

            $maintenance = Maintenance::firstOrCreate(
                [
                    'vehicle_id'  => $vehicle->id,
                    'date'        => $m['date']->toDateString(),
                    'description' => $m['description'],
                ],
                [
                    'responsible_id'        => $responsible?->id ?? $admin1?->id,
                    'type'                  => $m['type'],
                    'cost'                  => $m['cost'],
                    'provider'              => $m['provider'],
                    'next_maintenance_date' => $m['next_date']?->toDateString(),
                    'status'                => $m['status'],
                ]
            );

            // Crear costo asociado si hay costo
            if ($maintenance->wasRecentlyCreated && $m['cost'] > 0) {
                VehicleCost::firstOrCreate(
                    ['maintenance_id' => $maintenance->id],
                    [
                        'vehicle_id'    => $vehicle->id,
                        'registered_by' => $admin1?->id,
                        'category'      => 'maintenance',
                        'description'   => "Mantenimiento: {$m['description']}",
                        'amount'        => $m['cost'],
                        'date'          => $m['date']->toDateString(),
                    ]
                );
            }
        }
    }
}
