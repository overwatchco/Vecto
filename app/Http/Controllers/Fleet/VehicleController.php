<?php

namespace App\Http\Controllers\Fleet;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Models\VehicleStatusHistory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class VehicleController extends Controller
{
    private function companyScope()
    {
        $user = auth()->user();

        return $user->isSuperAdmin()
            ? Vehicle::query()
            : Vehicle::where('company_id', $user->company_id);
    }

    public function index(Request $request): Response
    {
        $query = $this->companyScope()->with('company');

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('plate', 'like', "%{$search}%")
                  ->orWhere('brand', 'like', "%{$search}%")
                  ->orWhere('model', 'like', "%{$search}%")
                  ->orWhere('vin',   'like', "%{$search}%");
            });
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $all      = $this->companyScope();
        $stats    = [
            'total'       => (clone $all)->count(),
            'active'      => (clone $all)->where('status', 'active')->count(),
            'maintenance' => (clone $all)->where('status', 'maintenance')->count(),
            'inactive'    => (clone $all)->where('status', 'inactive')->count(),
        ];

        $vehicles = $query->orderBy('plate')->get()
            ->map(fn (Vehicle $v) => [
                'id'           => $v->id,
                'plate'        => $v->plate,
                'type'         => $v->type,
                'brand'        => $v->brand,
                'model'        => $v->model,
                'year'         => $v->year,
                'color'        => $v->color,
                'vin'          => $v->vin,
                'status'       => $v->status,
                'photo'        => $v->photo ? Storage::url($v->photo) : null,
                'company_name' => $v->company->name ?? null,
            ]);

        return Inertia::render('fleet/vehicles/index', [
            'vehicles' => $vehicles,
            'stats'    => $stats,
            'filters'  => ['search' => $request->query('search', ''), 'status' => $request->query('status', '')],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('fleet/vehicles/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'plate'  => 'required|string|max:20|unique:vehicles',
            'type'   => 'required|string|max:50',
            'brand'  => 'required|string|max:50',
            'model'  => 'required|string|max:50',
            'year'   => 'required|integer|min:1990|max:' . (date('Y') + 1),
            'color'  => 'nullable|string|max:30',
            'vin'    => 'nullable|string|max:50|unique:vehicles',
            'status' => 'required|in:active,inactive,maintenance',
            'photo'  => 'nullable|image|max:2048',
            'notes'  => 'nullable|string',
        ]);

        $user = auth()->user();
        $data['company_id'] = $user->isSuperAdmin()
            ? $request->validate(['company_id' => 'required|exists:companies,id'])['company_id']
            : $user->company_id;

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('vehicles', 'public');
        }

        $vehicle = Vehicle::create($data);

        VehicleStatusHistory::create([
            'vehicle_id'   => $vehicle->id,
            'user_id'      => $user->id,
            'from_status'  => null,
            'to_status'    => $vehicle->status,
            'reason'       => 'Registro inicial',
        ]);

        return redirect()->route('fleet.vehicles.index')
            ->with('success', 'Vehículo registrado correctamente.');
    }

    public function show(Vehicle $vehicle): Response
    {
        $this->authorizeVehicle($vehicle);

        $vehicle->load(['company', 'lastLocation', 'maintenances' => fn ($q) => $q->latest('date')->limit(5)]);

        $totalCosts    = $vehicle->costs()->sum('amount');
        $totalRevenues = $vehicle->revenues()->sum('amount');

        return Inertia::render('fleet/vehicles/show', [
            'vehicle'        => array_merge($vehicle->toArray(), [
                'photo' => $vehicle->photo ? Storage::url($vehicle->photo) : null,
            ]),
            'total_costs'    => $totalCosts,
            'total_revenues' => $totalRevenues,
            'profit'         => $totalRevenues - $totalCosts,
        ]);
    }

    public function edit(Vehicle $vehicle): Response
    {
        $this->authorizeVehicle($vehicle);

        return Inertia::render('fleet/vehicles/edit', [
            'vehicle' => array_merge($vehicle->toArray(), [
                'photo_url' => $vehicle->photo ? Storage::url($vehicle->photo) : null,
            ]),
        ]);
    }

    public function update(Request $request, Vehicle $vehicle): RedirectResponse
    {
        $this->authorizeVehicle($vehicle);

        $data = $request->validate([
            'plate'  => 'required|string|max:20|unique:vehicles,plate,' . $vehicle->id,
            'type'   => 'required|string|max:50',
            'brand'  => 'required|string|max:50',
            'model'  => 'required|string|max:50',
            'year'   => 'required|integer|min:1990|max:' . (date('Y') + 1),
            'color'  => 'nullable|string|max:30',
            'vin'    => 'nullable|string|max:50|unique:vehicles,vin,' . $vehicle->id,
            'status' => 'required|in:active,inactive,maintenance',
            'photo'  => 'nullable|image|max:2048',
            'notes'  => 'nullable|string',
        ]);

        if ($request->hasFile('photo')) {
            if ($vehicle->photo) {
                Storage::disk('public')->delete($vehicle->photo);
            }
            $data['photo'] = $request->file('photo')->store('vehicles', 'public');
        }

        $oldStatus = $vehicle->status;
        $vehicle->update($data);

        if ($oldStatus !== $vehicle->status) {
            VehicleStatusHistory::create([
                'vehicle_id'  => $vehicle->id,
                'user_id'     => auth()->id(),
                'from_status' => $oldStatus,
                'to_status'   => $vehicle->status,
                'reason'      => $request->status_reason ?? 'Actualización manual',
            ]);
        }

        return redirect()->route('fleet.vehicles.index')
            ->with('success', 'Vehículo actualizado correctamente.');
    }

    public function destroy(Vehicle $vehicle): RedirectResponse
    {
        $this->authorizeVehicle($vehicle);

        $vehicle->delete();

        return redirect()->route('fleet.vehicles.index')
            ->with('success', 'Vehículo eliminado correctamente.');
    }

    private function authorizeVehicle(Vehicle $vehicle): void
    {
        $user = auth()->user();
        if (! $user->isSuperAdmin() && $vehicle->company_id !== $user->company_id) {
            abort(403);
        }
    }
}
