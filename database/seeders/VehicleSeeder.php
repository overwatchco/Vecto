<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Vehicle;
use App\Models\VehicleLocation;
use App\Models\VehicleStatusHistory;
use App\Models\User;
use Illuminate\Database\Seeder;

class VehicleSeeder extends Seeder
{
    public function run(): void
    {
        $empresa1 = Company::where('nit', '900123456-1')->first();
        $empresa2 = Company::where('nit', '800987654-2')->first();
        $admin1   = User::where('email', 'admin@andinos.com')->first();

        // ── Vehículos Empresa 1 ─────────────────────────────────────────────
        $vehiculos1 = [
            [
                'plate'  => 'SRK-521',
                'type'   => 'camión',
                'brand'  => 'Chevrolet',
                'model'  => 'NHR',
                'year'   => 2021,
                'color'  => 'Blanco',
                'vin'    => '3GCPCSE00BG123456',
                'status' => 'active',
            ],
            [
                'plate'  => 'TXL-874',
                'type'   => 'camión',
                'brand'  => 'Ford',
                'model'  => 'Cargo 1723',
                'year'   => 2020,
                'color'  => 'Azul',
                'vin'    => '9BFZZ5BFXBB234567',
                'status' => 'active',
            ],
            [
                'plate'  => 'UYP-302',
                'type'   => 'camioneta',
                'brand'  => 'Toyota',
                'model'  => 'Hilux',
                'year'   => 2022,
                'color'  => 'Gris',
                'vin'    => 'MR0EX32G802345678',
                'status' => 'maintenance',
            ],
            [
                'plate'  => 'VZQ-165',
                'type'   => 'van',
                'brand'  => 'Renault',
                'model'  => 'Master',
                'year'   => 2019,
                'color'  => 'Blanco',
                'vin'    => 'VF1JD000564567890',
                'status' => 'active',
            ],
            [
                'plate'  => 'WBN-739',
                'type'   => 'camión',
                'brand'  => 'Kenworth',
                'model'  => 'T370',
                'year'   => 2018,
                'color'  => 'Rojo',
                'vin'    => '1XKDDB9X6EJ789012',
                'status' => 'inactive',
            ],
        ];

        foreach ($vehiculos1 as $data) {
            $v = Vehicle::firstOrCreate(
                ['plate' => $data['plate']],
                array_merge($data, ['company_id' => $empresa1->id])
            );

            if ($v->wasRecentlyCreated) {
                VehicleStatusHistory::create([
                    'vehicle_id'  => $v->id,
                    'user_id'     => $admin1->id,
                    'from_status' => null,
                    'to_status'   => $v->status,
                    'reason'      => 'Registro inicial',
                ]);
            }
        }

        // ── Vehículos Empresa 2 ─────────────────────────────────────────────
        $admin2 = User::where('email', 'admin@logcaribe.com')->first();
        $vehiculos2 = [
            [
                'plate'  => 'XCM-441',
                'type'   => 'camión',
                'brand'  => 'Hino',
                'model'  => '500 FC9J',
                'year'   => 2023,
                'color'  => 'Amarillo',
                'vin'    => 'JHDFB8JT4KX890123',
                'status' => 'active',
            ],
            [
                'plate'  => 'YDN-558',
                'type'   => 'camioneta',
                'brand'  => 'Nissan',
                'model'  => 'NP300',
                'year'   => 2021,
                'color'  => 'Negro',
                'vin'    => '3N6CM0KN6MK901234',
                'status' => 'active',
            ],
        ];

        foreach ($vehiculos2 as $data) {
            $v = Vehicle::firstOrCreate(
                ['plate' => $data['plate']],
                array_merge($data, ['company_id' => $empresa2->id])
            );

            if ($v->wasRecentlyCreated) {
                VehicleStatusHistory::create([
                    'vehicle_id'  => $v->id,
                    'user_id'     => $admin2->id,
                    'from_status' => null,
                    'to_status'   => $v->status,
                    'reason'      => 'Registro inicial',
                ]);
            }
        }

        // ── Ubicaciones GPS demo ────────────────────────────────────────────
        $locaciones = [
            'SRK-521' => ['lat' =>  4.7110, 'lng' => -74.0721, 'address' => 'Av. Boyacá con Calle 80, Bogotá',       'speed' => 62],
            'TXL-874' => ['lat' =>  4.6534, 'lng' => -74.0577, 'address' => 'Autopista Sur Km 5, Bogotá',            'speed' => 45],
            'VZQ-165' => ['lat' =>  4.7245, 'lng' => -74.0635, 'address' => 'Calle 100 con Carrera 15, Bogotá',      'speed' =>  0],
            'XCM-441' => ['lat' => 10.9878, 'lng' => -74.7889, 'address' => 'Vía 40 Km 2, Barranquilla',             'speed' => 78],
            'YDN-558' => ['lat' => 10.9638, 'lng' => -74.7963, 'address' => 'Carrera 46 Zona Industrial, Barranquilla', 'speed' =>  0],
        ];

        foreach ($locaciones as $plate => $loc) {
            $vehicle = Vehicle::where('plate', $plate)->first();
            if (! $vehicle) continue;

            if (! $vehicle->lastLocation) {
                VehicleLocation::create([
                    'vehicle_id'  => $vehicle->id,
                    'latitude'    => $loc['lat'],
                    'longitude'   => $loc['lng'],
                    'address'     => $loc['address'],
                    'speed'       => $loc['speed'],
                    'recorded_at' => now()->subMinutes(rand(5, 120)),
                ]);
            }
        }
    }
}
