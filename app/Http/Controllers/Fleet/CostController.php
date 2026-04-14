<?php

namespace App\Http\Controllers\Fleet;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Models\VehicleCost;
use App\Models\VehicleRevenue;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CostController extends Controller
{
    private function vehicleScope()
    {
        $user = auth()->user();

        return $user->isSuperAdmin()
            ? Vehicle::query()
            : Vehicle::where('company_id', $user->company_id);
    }

    /** Dashboard de costos por flota */
    public function index(Request $request): Response
    {
        $vehicleIds = $this->vehicleScope()->pluck('id');
        $period     = $request->query('period', 'month'); // month, quarter, year
        $year       = $request->query('year', date('Y'));

        $dateFrom = match ($period) {
            'month'   => now()->startOfMonth(),
            'quarter' => now()->startOfQuarter(),
            'year'    => now()->startOfYear(),
            default   => now()->startOfMonth(),
        };

        $costs = VehicleCost::whereIn('vehicle_id', $vehicleIds)
            ->where('date', '>=', $dateFrom)
            ->with('vehicle:id,plate,brand,model')
            ->orderByDesc('date')
            ->get();

        $revenues = VehicleRevenue::whereIn('vehicle_id', $vehicleIds)
            ->where('date', '>=', $dateFrom)
            ->get();

        $totalCosts    = $costs->sum('amount');
        $totalRevenues = $revenues->sum('amount');

        $byCategory = $costs->groupBy('category')->map(fn ($g) => [
            'total' => $g->sum('amount'),
            'count' => $g->count(),
        ]);

        $byVehicle = $costs->groupBy('vehicle_id')->map(function ($group) use ($revenues) {
            $vehicleRevenues = $revenues->where('vehicle_id', $group->first()->vehicle_id)->sum('amount');
            $vehicleCosts    = $group->sum('amount');

            return [
                'vehicle_label' => $group->first()->vehicle
                    ? "{$group->first()->vehicle->brand} {$group->first()->vehicle->model} — {$group->first()->vehicle->plate}"
                    : 'N/A',
                'total_costs'    => $vehicleCosts,
                'total_revenues' => $vehicleRevenues,
                'profit'         => $vehicleRevenues - $vehicleCosts,
                'count'          => $group->count(),
            ];
        })->values();

        return Inertia::render('fleet/costs/index', [
            'period'         => $period,
            'year'           => (int) $year,
            'total_costs'    => $totalCosts,
            'total_revenues' => $totalRevenues,
            'profit'         => $totalRevenues - $totalCosts,
            'by_category'    => $byCategory,
            'by_vehicle'     => $byVehicle,
            'recent_costs'   => $costs->take(20)->map(fn ($c) => [
                'id'            => $c->id,
                'vehicle_label' => $c->vehicle ? "{$c->vehicle->brand} {$c->vehicle->model} — {$c->vehicle->plate}" : 'N/A',
                'category'      => $c->category,
                'description'   => $c->description,
                'amount'        => $c->amount,
                'date'          => $c->date?->format('d/m/Y'),
            ]),
        ]);
    }

    public function create(): Response
    {
        $vehicles = $this->vehicleScope()->orderBy('plate')
            ->get(['id', 'plate', 'brand', 'model'])
            ->map(fn ($v) => ['value' => $v->id, 'label' => "{$v->brand} {$v->model} — {$v->plate}"]);

        $categories = [
            ['value' => 'maintenance', 'label' => 'Mantenimiento'],
            ['value' => 'fuel',        'label' => 'Combustible'],
            ['value' => 'materials',   'label' => 'Materiales/Repuestos'],
            ['value' => 'insurance',   'label' => 'Seguros'],
            ['value' => 'taxes',       'label' => 'Impuestos/Peajes'],
            ['value' => 'other',       'label' => 'Otros'],
        ];

        return Inertia::render('fleet/costs/create', [
            'vehicles'   => $vehicles,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'vehicle_id'   => 'required|exists:vehicles,id',
            'category'     => 'required|in:maintenance,fuel,materials,insurance,taxes,tolls,other',
            'description'  => 'required|string|max:255',
            'amount'       => 'required|numeric|min:0',
            'date'         => 'required|date',
            'invoice_ref'  => 'nullable|string|max:100',
        ]);

        $vehicle = Vehicle::findOrFail($data['vehicle_id']);
        $user    = auth()->user();
        if (! $user->isSuperAdmin() && $vehicle->company_id !== $user->company_id) {
            abort(403);
        }

        VehicleCost::create(array_merge($data, ['registered_by' => $user->id]));

        return redirect()->route('fleet.costs.index')
            ->with('success', 'Costo registrado correctamente.');
    }

    public function destroy(VehicleCost $cost): RedirectResponse
    {
        $vehicle = $cost->vehicle;
        $user    = auth()->user();
        if (! $user->isSuperAdmin() && $vehicle->company_id !== $user->company_id) {
            abort(403);
        }

        $cost->delete();

        return back()->with('success', 'Costo eliminado.');
    }

    /** Vista detallada por vehículo */
    public function vehicle(Vehicle $vehicle): Response
    {
        $user = auth()->user();
        if (! $user->isSuperAdmin() && $vehicle->company_id !== $user->company_id) {
            abort(403);
        }

        $costs    = $vehicle->costs()->orderByDesc('date')->get();
        $revenues = $vehicle->revenues()->orderByDesc('date')->get();

        $totalCosts    = $costs->sum('amount');
        $totalRevenues = $revenues->sum('amount');

        $byMonth = $costs->groupBy(fn ($c) => $c->date->format('Y-m'))->map(fn ($g) => [
            'month'  => $g->first()->date->format('M Y'),
            'total'  => $g->sum('amount'),
        ])->values()->sortBy('month')->values();

        return Inertia::render('fleet/costs/vehicle', [
            'vehicle'        => [
                'id'    => $vehicle->id,
                'label' => "{$vehicle->brand} {$vehicle->model} — {$vehicle->plate}",
                'plate' => $vehicle->plate,
            ],
            'total_costs'    => $totalCosts,
            'total_revenues' => $totalRevenues,
            'profit'         => $totalRevenues - $totalCosts,
            'monthly'        => $byMonth,
            'costs'          => $costs->map(fn ($c) => [
                'id'          => $c->id,
                'category'    => $c->category,
                'description' => $c->description,
                'amount'      => $c->amount,
                'date'        => $c->date?->format('d/m/Y'),
            ]),
            'revenues' => $revenues->map(fn ($r) => [
                'id'          => $r->id,
                'description' => $r->description,
                'amount'      => $r->amount,
                'date'        => $r->date?->format('d/m/Y'),
            ]),
        ]);
    }
}
