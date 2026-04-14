<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Material;
use App\Models\MaterialMovement;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class MaterialSeeder extends Seeder
{
    public function run(): void
    {
        $empresa1 = Company::where('nit', '900123456-1')->first();
        $admin1   = User::where('email', 'admin@andinos.com')->first();

        $materiales = [
            ['name' => 'Aceite de motor 10W-40',         'ref' => 'ACE-10W40',  'unit' => 'lt',  'cost' => 18000,  'stock' => 24,   'min' => 10, 'loc' => 'Estante A-1', 'prov' => 'Distribuidora Lubricantes SA'],
            ['name' => 'Filtro de aceite estándar',       'ref' => 'FILT-ACE',   'unit' => 'und', 'cost' => 28000,  'stock' => 15,   'min' =>  5, 'loc' => 'Estante A-2', 'prov' => 'Autopartes Colombia'],
            ['name' => 'Filtro de aire',                  'ref' => 'FILT-AIR',   'unit' => 'und', 'cost' => 45000,  'stock' => 8,    'min' =>  4, 'loc' => 'Estante A-2', 'prov' => 'Autopartes Colombia'],
            ['name' => 'Filtro de combustible',           'ref' => 'FILT-COMB',  'unit' => 'und', 'cost' => 32000,  'stock' => 6,    'min' =>  4, 'loc' => 'Estante A-3', 'prov' => 'Autopartes Colombia'],
            ['name' => 'Pastillas de freno delanteras',   'ref' => 'PAST-FREN-D','unit' => 'par', 'cost' => 85000,  'stock' => 4,    'min' =>  2, 'loc' => 'Estante B-1', 'prov' => 'Frenasa Bogotá'],
            ['name' => 'Pastillas de freno traseras',     'ref' => 'PAST-FREN-T','unit' => 'par', 'cost' => 72000,  'stock' => 3,    'min' =>  2, 'loc' => 'Estante B-1', 'prov' => 'Frenasa Bogotá'],
            ['name' => 'Líquido de frenos DOT-4',         'ref' => 'LIQ-DOT4',   'unit' => 'lt',  'cost' => 22000,  'stock' => 5,    'min' =>  2, 'loc' => 'Estante B-2', 'prov' => 'Distribuidora Lubricantes SA'],
            ['name' => 'Correa de distribución',          'ref' => 'COR-DIST',   'unit' => 'und', 'cost' => 120000, 'stock' => 2,    'min' =>  1, 'loc' => 'Estante C-1', 'prov' => 'Autopartes Colombia'],
            ['name' => 'Refrigerante anticongelante',     'ref' => 'REFR-AC',    'unit' => 'lt',  'cost' => 15000,  'stock' => 10,   'min' =>  4, 'loc' => 'Estante B-3', 'prov' => 'Distribuidora Lubricantes SA'],
            ['name' => 'Bombillo H4 (luz delantera)',     'ref' => 'BOMB-H4',    'unit' => 'und', 'cost' => 12000,  'stock' => 2,    'min' =>  4, 'loc' => 'Estante D-1', 'prov' => 'Eléctricos del Centro'],  // stock bajo
            ['name' => 'Fusibles variados (caja 100 und)','ref' => 'FUS-VAR',    'unit' => 'caja','cost' => 8000,   'stock' => 3,    'min' =>  2, 'loc' => 'Estante D-1', 'prov' => 'Eléctricos del Centro'],
            ['name' => 'Grasa multiusos',                 'ref' => 'GRAS-MUL',   'unit' => 'kg',  'cost' => 9500,   'stock' => 1,    'min' =>  3, 'loc' => 'Estante A-4', 'prov' => 'Distribuidora Lubricantes SA'],  // stock bajo
        ];

        $creados = [];
        foreach ($materiales as $m) {
            $material = Material::firstOrCreate(
                ['company_id' => $empresa1->id, 'reference' => $m['ref']],
                [
                    'name'               => $m['name'],
                    'unit'               => $m['unit'],
                    'unit_cost'          => $m['cost'],
                    'stock'              => $m['stock'],
                    'min_stock'          => $m['min'],
                    'provider'           => $m['prov'],
                    'warehouse_location' => $m['loc'],
                    'is_active'          => true,
                ]
            );
            $creados[$m['ref']] = $material;
        }

        // ── Movimientos de entrada ──────────────────────────────────────────
        $entradas = [
            ['ref' => 'ACE-10W40', 'qty' => 20, 'date' => Carbon::now()->subDays(30), 'reason' => 'Compra mensual'],
            ['ref' => 'FILT-ACE',  'qty' => 10, 'date' => Carbon::now()->subDays(30), 'reason' => 'Compra mensual'],
            ['ref' => 'FILT-AIR',  'qty' => 5,  'date' => Carbon::now()->subDays(15), 'reason' => 'Reabastecimiento'],
            ['ref' => 'PAST-FREN-D','qty'=> 4,  'date' => Carbon::now()->subDays(20), 'reason' => 'Compra semestral'],
        ];

        foreach ($entradas as $e) {
            $material = $creados[$e['ref']] ?? null;
            if (! $material) continue;

            MaterialMovement::firstOrCreate(
                ['material_id' => $material->id, 'type' => 'in', 'date' => $e['date']->toDateString()],
                [
                    'user_id'   => $admin1?->id,
                    'quantity'  => $e['qty'],
                    'unit_cost' => $material->unit_cost,
                    'reason'    => $e['reason'],
                ]
            );
        }

        // ── Movimientos de salida (consumos) ────────────────────────────────
        $salidas = [
            ['ref' => 'ACE-10W40',  'qty' => 5,  'date' => Carbon::now()->subDays(8),  'reason' => 'Mantenimiento SRK-521'],
            ['ref' => 'FILT-ACE',   'qty' => 1,  'date' => Carbon::now()->subDays(8),  'reason' => 'Mantenimiento SRK-521'],
            ['ref' => 'ACE-10W40',  'qty' => 5,  'date' => Carbon::now()->subDays(3),  'reason' => 'Mantenimiento TXL-874'],
            ['ref' => 'FILT-COMB',  'qty' => 1,  'date' => Carbon::now()->subDays(3),  'reason' => 'Mantenimiento TXL-874'],
            ['ref' => 'FILT-AIR',   'qty' => 1,  'date' => Carbon::now()->subDays(3),  'reason' => 'Mantenimiento TXL-874'],
            ['ref' => 'BOMB-H4',    'qty' => 2,  'date' => Carbon::now()->subDays(1),  'reason' => 'Reposición VZQ-165'],
        ];

        foreach ($salidas as $s) {
            $material = $creados[$s['ref']] ?? null;
            if (! $material) continue;

            MaterialMovement::firstOrCreate(
                ['material_id' => $material->id, 'type' => 'out', 'date' => $s['date']->toDateString(), 'reason' => $s['reason']],
                [
                    'user_id'   => $admin1?->id,
                    'quantity'  => $s['qty'],
                    'unit_cost' => $material->unit_cost,
                ]
            );
        }
    }
}
