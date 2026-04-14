<?php

namespace App\Http\Controllers\Fleet;

use App\Http\Controllers\Controller;
use App\Models\Base;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BaseController extends Controller
{
    private function scope()
    {
        $user = auth()->user();

        return $user->isSuperAdmin()
            ? Base::query()
            : Base::where('company_id', $user->company_id);
    }

    public function index(): Response
    {
        $bases = $this->scope()
            ->withCount('vehicles', 'operators')
            ->orderBy('name')
            ->get()
            ->map(fn (Base $b) => [
                'id'               => $b->id,
                'name'             => $b->name,
                'address'          => $b->address,
                'capacity'         => $b->capacity,
                'vehicles_count'   => $b->vehicles_count,
                'operators_count'  => $b->operators_count,
                'occupancy_pct'    => $b->capacity > 0
                    ? round(($b->vehicles_count / $b->capacity) * 100)
                    : 0,
                'is_active'        => $b->is_active,
                'latitude'         => $b->latitude,
                'longitude'        => $b->longitude,
            ]);

        return Inertia::render('fleet/bases/index', [
            'bases' => $bases,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('fleet/bases/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name'      => 'required|string|max:100',
            'address'   => 'nullable|string',
            'latitude'  => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'capacity'  => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $data['company_id'] = auth()->user()->company_id;

        Base::create($data);

        return redirect()->route('fleet.bases.index')
            ->with('success', 'Base creada correctamente.');
    }

    public function show(Base $base): Response
    {
        $this->authorizeBase($base);

        $base->load('vehicles:id,plate,brand,model,status', 'operators:id,name,position');

        $availableVehicles = Vehicle::where('company_id', $base->company_id)
            ->where('status', 'active')
            ->whereNotIn('id', $base->vehicles->pluck('id'))
            ->orderBy('plate')
            ->get(['id', 'plate', 'brand', 'model'])
            ->map(fn ($v) => ['value' => $v->id, 'label' => "{$v->brand} {$v->model} — {$v->plate}"]);

        $availableOperators = User::where('company_id', $base->company_id)
            ->where('role', 'operator')
            ->whereNotIn('id', $base->operators->pluck('id'))
            ->orderBy('name')
            ->get(['id', 'name', 'position'])
            ->map(fn ($u) => ['value' => $u->id, 'label' => "{$u->name}" . ($u->position ? " — {$u->position}" : '')]);

        return Inertia::render('fleet/bases/show', [
            'base'               => $base,
            'available_vehicles' => $availableVehicles,
            'available_operators' => $availableOperators,
        ]);
    }

    public function edit(Base $base): Response
    {
        $this->authorizeBase($base);

        return Inertia::render('fleet/bases/edit', [
            'base' => $base,
        ]);
    }

    public function update(Request $request, Base $base): RedirectResponse
    {
        $this->authorizeBase($base);

        $data = $request->validate([
            'name'      => 'required|string|max:100',
            'address'   => 'nullable|string',
            'latitude'  => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'capacity'  => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $base->update($data);

        return redirect()->route('fleet.bases.index')
            ->with('success', 'Base actualizada correctamente.');
    }

    public function destroy(Base $base): RedirectResponse
    {
        $this->authorizeBase($base);
        $base->delete();

        return redirect()->route('fleet.bases.index')
            ->with('success', 'Base eliminada.');
    }

    public function assignVehicle(Request $request, Base $base): RedirectResponse
    {
        $this->authorizeBase($base);

        $data = $request->validate([
            'vehicle_id'  => 'required|exists:vehicles,id',
            'assigned_at' => 'required|date',
        ]);

        $base->vehicles()->attach($data['vehicle_id'], ['assigned_at' => $data['assigned_at']]);

        return back()->with('success', 'Vehículo asignado a la base.');
    }

    public function assignOperator(Request $request, Base $base): RedirectResponse
    {
        $this->authorizeBase($base);

        $data = $request->validate([
            'user_id'     => 'required|exists:users,id',
            'assigned_at' => 'required|date',
        ]);

        $base->operators()->attach($data['user_id'], ['assigned_at' => $data['assigned_at']]);

        return back()->with('success', 'Operador asignado a la base.');
    }

    public function removeVehicle(Base $base, Vehicle $vehicle): RedirectResponse
    {
        $this->authorizeBase($base);
        $base->vehicles()->detach($vehicle->id);

        return back()->with('success', 'Vehículo removido de la base.');
    }

    public function removeOperator(Base $base, User $user): RedirectResponse
    {
        $this->authorizeBase($base);
        $base->operators()->detach($user->id);

        return back()->with('success', 'Operador removido de la base.');
    }

    private function authorizeBase(Base $base): void
    {
        $user = auth()->user();
        if (! $user->isSuperAdmin() && $base->company_id !== $user->company_id) {
            abort(403);
        }
    }
}
