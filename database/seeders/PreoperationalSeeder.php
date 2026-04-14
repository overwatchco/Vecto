<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\PreoperationalInspection;
use App\Models\PreoperationalItem;
use App\Models\PreoperationalResponse;
use App\Models\User;
use App\Models\Vehicle;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class PreoperationalSeeder extends Seeder
{
    public function run(): void
    {
        $empresa1 = Company::where('nit', '900123456-1')->first();
        $empresa2 = Company::where('nit', '800987654-2')->first();

        // ── Checklist items empresa 1 ───────────────────────────────────────
        $itemsConfig = [
            ['category' => 'Frenos',      'name' => 'Freno de servicio (pedal firme)',       'required' => true,  'order' => 1],
            ['category' => 'Frenos',      'name' => 'Freno de parqueo',                      'required' => true,  'order' => 2],
            ['category' => 'Luces',       'name' => 'Luces delanteras (alta y baja)',         'required' => true,  'order' => 1],
            ['category' => 'Luces',       'name' => 'Luces traseras y de freno',              'required' => true,  'order' => 2],
            ['category' => 'Luces',       'name' => 'Direccionales y luces de emergencia',   'required' => true,  'order' => 3],
            ['category' => 'Llantas',     'name' => 'Presión correcta (todas las llantas)',  'required' => true,  'order' => 1],
            ['category' => 'Llantas',     'name' => 'Estado del labrado (mín. 3mm)',         'required' => true,  'order' => 2],
            ['category' => 'Llantas',     'name' => 'Llanta de repuesto disponible',         'required' => false, 'order' => 3],
            ['category' => 'Fluidos',     'name' => 'Nivel de aceite del motor',             'required' => true,  'order' => 1],
            ['category' => 'Fluidos',     'name' => 'Nivel de agua del radiador',            'required' => true,  'order' => 2],
            ['category' => 'Fluidos',     'name' => 'Nivel de líquido de frenos',            'required' => true,  'order' => 3],
            ['category' => 'Fluidos',     'name' => 'Nivel de combustible',                  'required' => true,  'order' => 4],
            ['category' => 'Documentos',  'name' => 'SOAT vigente',                          'required' => true,  'order' => 1],
            ['category' => 'Documentos',  'name' => 'Revisión técnico-mecánica vigente',     'required' => true,  'order' => 2],
            ['category' => 'Documentos',  'name' => 'Tarjeta de operación',                  'required' => true,  'order' => 3],
            ['category' => 'Seguridad',   'name' => 'Extintor cargado y vigente',            'required' => true,  'order' => 1],
            ['category' => 'Seguridad',   'name' => 'Botiquín de primeros auxilios',         'required' => true,  'order' => 2],
            ['category' => 'Seguridad',   'name' => 'Conos y triangulos de seguridad',       'required' => false, 'order' => 3],
            ['category' => 'Carrocería',  'name' => 'Sin daños visibles en carrocería',      'required' => false, 'order' => 1],
            ['category' => 'Carrocería',  'name' => 'Retrovisores en buen estado',           'required' => true,  'order' => 2],
        ];

        $items1 = [];
        foreach ($itemsConfig as $cfg) {
            $item = PreoperationalItem::firstOrCreate(
                ['company_id' => $empresa1->id, 'name' => $cfg['name']],
                [
                    'category'   => $cfg['category'],
                    'is_required'=> $cfg['required'],
                    'sort_order' => $cfg['order'],
                    'is_active'  => true,
                ]
            );
            $items1[] = $item;
        }

        // Mismos ítems para empresa 2 (simplificado)
        $items2 = [];
        foreach (array_slice($itemsConfig, 0, 12) as $cfg) {
            $item = PreoperationalItem::firstOrCreate(
                ['company_id' => $empresa2->id, 'name' => $cfg['name']],
                [
                    'category'   => $cfg['category'],
                    'is_required'=> $cfg['required'],
                    'sort_order' => $cfg['order'],
                    'is_active'  => true,
                ]
            );
            $items2[] = $item;
        }

        // ── Inspecciones demo ───────────────────────────────────────────────
        $operadores = [
            'jperez@andinos.com'   => User::where('email', 'jperez@andinos.com')->first(),
            'lgomez@andinos.com'   => User::where('email', 'lgomez@andinos.com')->first(),
            'mtorres@andinos.com'  => User::where('email', 'mtorres@andinos.com')->first(),
            'avargas@logcaribe.com'=> User::where('email', 'avargas@logcaribe.com')->first(),
        ];

        $inspecciones = [
            // SRK-521 — apto
            ['plate' => 'SRK-521', 'operator' => 'jperez@andinos.com', 'result' => 'fit',
             'odometer' => 87450, 'hours_ago' => 2, 'obs' => null, 'items' => $items1],

            // SRK-521 — apto con observaciones (ayer)
            ['plate' => 'SRK-521', 'operator' => 'jperez@andinos.com', 'result' => 'fit_with_observations',
             'odometer' => 87390, 'hours_ago' => 26, 'obs' => 'Nivel de combustible bajo, recargar antes de salir.',
             'fail_item' => 'Nivel de combustible', 'items' => $items1],

            // TXL-874 — apto
            ['plate' => 'TXL-874', 'operator' => 'lgomez@andinos.com', 'result' => 'fit',
             'odometer' => 124300, 'hours_ago' => 3, 'obs' => null, 'items' => $items1],

            // VZQ-165 — no apto
            ['plate' => 'VZQ-165', 'operator' => 'mtorres@andinos.com', 'result' => 'unfit',
             'odometer' => 53210, 'hours_ago' => 1, 'obs' => 'Falla en luz trasera derecha. No sale hasta ser reparado.',
             'fail_item' => 'Luces traseras y de freno', 'items' => $items1],

            // XCM-441 — apto
            ['plate' => 'XCM-441', 'operator' => 'avargas@logcaribe.com', 'result' => 'fit',
             'odometer' => 61200, 'hours_ago' => 4, 'obs' => null, 'items' => $items2],
        ];

        foreach ($inspecciones as $ins) {
            $vehicle  = Vehicle::where('plate', $ins['plate'])->first();
            $operator = $operadores[$ins['operator']] ?? null;
            if (! $vehicle || ! $operator) continue;

            $inspection = PreoperationalInspection::firstOrCreate(
                [
                    'vehicle_id'  => $vehicle->id,
                    'inspector_id'=> $operator->id,
                    'inspected_at'=> Carbon::now()->subHours($ins['hours_ago'])->toDateTimeString(),
                ],
                [
                    'result'       => $ins['result'],
                    'observations' => $ins['obs'],
                    'odometer'     => $ins['odometer'],
                ]
            );

            if ($inspection->wasRecentlyCreated) {
                foreach ($ins['items'] as $item) {
                    $isFail = isset($ins['fail_item']) && str_contains($item->name, explode(' ', $ins['fail_item'])[0]);
                    PreoperationalResponse::create([
                        'inspection_id' => $inspection->id,
                        'item_id'       => $item->id,
                        'value'         => $isFail ? 'fail' : 'ok',
                        'note'          => $isFail ? "Falla detectada: {$item->name}" : null,
                    ]);
                }
            }
        }
    }
}
