<?php

namespace App\Http\Controllers\Fleet;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\Vehicle;
use App\Models\VehicleRevenue;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RevenueController extends Controller
{
    private function vehicleScope()
    {
        $user = auth()->user();

        return $user->isSuperAdmin()
            ? Vehicle::query()
            : Vehicle::where('company_id', $user->company_id);
    }

    public function index(): Response
    {
        $vehicleIds = $this->vehicleScope()->pluck('id');

        $revenues = VehicleRevenue::whereIn('vehicle_id', $vehicleIds)
            ->with('vehicle:id,plate,brand,model', 'contract:id,client')
            ->orderByDesc('date')
            ->get()
            ->map(fn ($r) => [
                'id'             => $r->id,
                'vehicle_label'  => $r->vehicle ? "{$r->vehicle->brand} {$r->vehicle->model} — {$r->vehicle->plate}" : 'N/A',
                'contract_client' => $r->contract?->client,
                'description'    => $r->description,
                'amount'         => $r->amount,
                'date'           => $r->date?->format('d/m/Y'),
                'invoice_ref'    => $r->invoice_ref,
            ]);

        return Inertia::render('fleet/revenues/index', [
            'revenues'      => $revenues,
            'total_revenue' => $revenues->sum('amount'),
        ]);
    }

    public function create(): Response
    {
        $user = auth()->user();

        $vehicles = $this->vehicleScope()->orderBy('plate')
            ->get(['id', 'plate', 'brand', 'model'])
            ->map(fn ($v) => ['value' => $v->id, 'label' => "{$v->brand} {$v->model} — {$v->plate}"]);

        $contracts = Contract::when(! $user->isSuperAdmin(), fn ($q) => $q->where('company_id', $user->company_id))
            ->where('status', 'active')
            ->orderBy('client')
            ->get(['id', 'client', 'service_type'])
            ->map(fn ($c) => ['value' => $c->id, 'label' => "{$c->client} — {$c->service_type}"]);

        return Inertia::render('fleet/revenues/create', [
            'vehicles'  => $vehicles,
            'contracts' => $contracts,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'vehicle_id'  => 'required|exists:vehicles,id',
            'contract_id' => 'nullable|exists:contracts,id',
            'description' => 'required|string|max:255',
            'amount'      => 'required|numeric|min:0',
            'date'        => 'required|date',
            'invoice_ref' => 'nullable|string|max:100',
        ]);

        $vehicle = Vehicle::findOrFail($data['vehicle_id']);
        $user    = auth()->user();
        if (! $user->isSuperAdmin() && $vehicle->company_id !== $user->company_id) {
            abort(403);
        }

        VehicleRevenue::create(array_merge($data, ['registered_by' => $user->id]));

        return redirect()->route('fleet.revenues.index')
            ->with('success', 'Ingreso registrado correctamente.');
    }

    public function destroy(VehicleRevenue $revenue): RedirectResponse
    {
        $vehicle = $revenue->vehicle;
        $user    = auth()->user();
        if (! $user->isSuperAdmin() && $vehicle->company_id !== $user->company_id) {
            abort(403);
        }

        $revenue->delete();

        return back()->with('success', 'Ingreso eliminado.');
    }
}
