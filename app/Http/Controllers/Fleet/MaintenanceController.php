<?php

namespace App\Http\Controllers\Fleet;

use App\Http\Controllers\Controller;
use App\Models\Maintenance;
use App\Models\Vehicle;
use App\Models\VehicleCost;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MaintenanceController extends Controller
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

        $upcoming = Maintenance::whereIn('vehicle_id', $vehicleIds)
            ->where('status', 'scheduled')
            ->where('date', '<=', Carbon::now()->addDays(7))
            ->count();

        $maintenances = Maintenance::whereIn('vehicle_id', $vehicleIds)
            ->with('vehicle:id,plate,brand,model', 'responsible:id,name')
            ->orderByDesc('date')
            ->get()
            ->map(fn (Maintenance $m) => [
                'id'                    => $m->id,
                'vehicle_plate'         => $m->vehicle->plate ?? '',
                'vehicle_label'         => $m->vehicle ? "{$m->vehicle->brand} {$m->vehicle->model} — {$m->vehicle->plate}" : '',
                'type'                  => $m->type,
                'date'                  => $m->date?->format('d/m/Y'),
                'description'           => $m->description,
                'cost'                  => $m->cost,
                'provider'              => $m->provider,
                'status'                => $m->status,
                'next_maintenance_date' => $m->next_maintenance_date?->format('d/m/Y'),
                'responsible_name'      => $m->responsible?->name,
            ]);

        return Inertia::render('fleet/maintenances/index', [
            'maintenances'    => $maintenances,
            'upcoming_alerts' => $upcoming,
        ]);
    }

    public function create(): Response
    {
        $vehicles = $this->vehicleScope()->orderBy('plate')
            ->get(['id', 'plate', 'brand', 'model'])
            ->map(fn ($v) => ['value' => $v->id, 'label' => "{$v->brand} {$v->model} — {$v->plate}"]);

        return Inertia::render('fleet/maintenances/create', [
            'vehicles' => $vehicles,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'vehicle_id'             => 'required|exists:vehicles,id',
            'type'                   => 'required|in:preventive,corrective',
            'date'                   => 'required|date',
            'description'            => 'required|string',
            'cost'                   => 'nullable|numeric|min:0',
            'provider'               => 'nullable|string|max:100',
            'next_maintenance_date'  => 'nullable|date|after:date',
            'next_maintenance_km'    => 'nullable|integer|min:0',
            'status'                 => 'required|in:scheduled,in_progress,completed,cancelled',
            'notes'                  => 'nullable|string',
        ]);

        $vehicle = Vehicle::findOrFail($data['vehicle_id']);
        $this->authorizeVehicle($vehicle);

        $data['responsible_id'] = auth()->id();
        $data['cost']           = $data['cost'] ?? 0;

        $maintenance = Maintenance::create($data);

        if ($maintenance->cost > 0) {
            VehicleCost::create([
                'vehicle_id'     => $maintenance->vehicle_id,
                'registered_by'  => auth()->id(),
                'maintenance_id' => $maintenance->id,
                'category'       => 'maintenance',
                'description'    => "Mantenimiento: {$maintenance->description}",
                'amount'         => $maintenance->cost,
                'date'           => $maintenance->date,
            ]);
        }

        return redirect()->route('fleet.maintenances.index')
            ->with('success', 'Mantenimiento registrado correctamente.');
    }

    public function show(Maintenance $maintenance): Response
    {
        $this->authorizeVehicle($maintenance->vehicle);
        $maintenance->load('vehicle', 'responsible', 'materialMovements.material');

        return Inertia::render('fleet/maintenances/show', [
            'maintenance' => $maintenance,
        ]);
    }

    public function edit(Maintenance $maintenance): Response
    {
        $this->authorizeVehicle($maintenance->vehicle);

        $vehicles = $this->vehicleScope()->orderBy('plate')
            ->get(['id', 'plate', 'brand', 'model'])
            ->map(fn ($v) => ['value' => $v->id, 'label' => "{$v->brand} {$v->model} — {$v->plate}"]);

        return Inertia::render('fleet/maintenances/edit', [
            'maintenance' => $maintenance,
            'vehicles'    => $vehicles,
        ]);
    }

    public function update(Request $request, Maintenance $maintenance): RedirectResponse
    {
        $this->authorizeVehicle($maintenance->vehicle);

        $data = $request->validate([
            'vehicle_id'            => 'required|exists:vehicles,id',
            'type'                  => 'required|in:preventive,corrective',
            'date'                  => 'required|date',
            'description'           => 'required|string',
            'cost'                  => 'nullable|numeric|min:0',
            'provider'              => 'nullable|string|max:100',
            'next_maintenance_date' => 'nullable|date',
            'next_maintenance_km'   => 'nullable|integer|min:0',
            'status'                => 'required|in:scheduled,in_progress,completed,cancelled',
            'notes'                 => 'nullable|string',
        ]);

        $maintenance->update($data);

        return redirect()->route('fleet.maintenances.index')
            ->with('success', 'Mantenimiento actualizado correctamente.');
    }

    public function destroy(Maintenance $maintenance): RedirectResponse
    {
        $this->authorizeVehicle($maintenance->vehicle);
        $maintenance->delete();

        return redirect()->route('fleet.maintenances.index')
            ->with('success', 'Mantenimiento eliminado.');
    }

    private function authorizeVehicle(?Vehicle $vehicle): void
    {
        if (! $vehicle) {
            abort(404);
        }
        $user = auth()->user();
        if (! $user->isSuperAdmin() && $vehicle->company_id !== $user->company_id) {
            abort(403);
        }
    }
}
