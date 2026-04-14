<?php

namespace App\Http\Controllers\Fleet;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\Vehicle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContractController extends Controller
{
    private function scope()
    {
        $user = auth()->user();

        return $user->isSuperAdmin()
            ? Contract::query()
            : Contract::where('company_id', $user->company_id);
    }

    public function index(): Response
    {
        $contracts = $this->scope()
            ->withCount('vehicles')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (Contract $c) => [
                'id'              => $c->id,
                'code'            => $c->code,
                'client'          => $c->client,
                'service_type'    => $c->service_type,
                'rate'            => $c->rate,
                'rate_unit'       => $c->rate_unit,
                'start_date'      => $c->start_date?->format('d/m/Y'),
                'end_date'        => $c->end_date?->format('d/m/Y'),
                'status'          => $c->status,
                'vehicles_count'  => $c->vehicles_count,
            ]);

        return Inertia::render('fleet/contracts/index', [
            'contracts' => $contracts,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('fleet/contracts/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'code'         => 'nullable|string|max:50',
            'client'       => 'required|string|max:150',
            'service_type' => 'required|string|max:100',
            'rate'         => 'required|numeric|min:0',
            'rate_unit'    => 'required|string|max:20',
            'start_date'   => 'required|date',
            'end_date'     => 'nullable|date|after:start_date',
            'conditions'   => 'nullable|string',
            'status'       => 'required|in:active,expired,suspended',
        ]);

        $data['company_id'] = auth()->user()->company_id;

        Contract::create($data);

        return redirect()->route('fleet.contracts.index')
            ->with('success', 'Contrato creado correctamente.');
    }

    public function show(Contract $contract): Response
    {
        $this->authorizeContract($contract);

        $contract->load('vehicles:id,plate,brand,model,status');

        $availableVehicles = Vehicle::where('company_id', $contract->company_id)
            ->where('status', 'active')
            ->whereNotIn('id', $contract->vehicles->pluck('id'))
            ->orderBy('plate')
            ->get(['id', 'plate', 'brand', 'model'])
            ->map(fn ($v) => ['value' => $v->id, 'label' => "{$v->brand} {$v->model} — {$v->plate}"]);

        return Inertia::render('fleet/contracts/show', [
            'contract'           => $contract,
            'available_vehicles' => $availableVehicles,
        ]);
    }

    public function edit(Contract $contract): Response
    {
        $this->authorizeContract($contract);

        return Inertia::render('fleet/contracts/edit', [
            'contract' => $contract,
        ]);
    }

    public function update(Request $request, Contract $contract): RedirectResponse
    {
        $this->authorizeContract($contract);

        $data = $request->validate([
            'code'         => 'nullable|string|max:50',
            'client'       => 'required|string|max:150',
            'service_type' => 'required|string|max:100',
            'rate'         => 'required|numeric|min:0',
            'rate_unit'    => 'required|string|max:20',
            'start_date'   => 'required|date',
            'end_date'     => 'nullable|date',
            'conditions'   => 'nullable|string',
            'status'       => 'required|in:active,expired,suspended',
        ]);

        $contract->update($data);

        return redirect()->route('fleet.contracts.index')
            ->with('success', 'Contrato actualizado correctamente.');
    }

    public function destroy(Contract $contract): RedirectResponse
    {
        $this->authorizeContract($contract);
        $contract->delete();

        return redirect()->route('fleet.contracts.index')
            ->with('success', 'Contrato eliminado.');
    }

    public function assignVehicle(Request $request, Contract $contract): RedirectResponse
    {
        $this->authorizeContract($contract);

        $data = $request->validate([
            'vehicle_id'  => 'required|exists:vehicles,id',
            'assigned_at' => 'required|date',
        ]);

        $contract->vehicles()->attach($data['vehicle_id'], [
            'assigned_at' => $data['assigned_at'],
        ]);

        return back()->with('success', 'Vehículo asignado al contrato.');
    }

    public function removeVehicle(Contract $contract, Vehicle $vehicle): RedirectResponse
    {
        $this->authorizeContract($contract);

        $contract->vehicles()->updateExistingPivot($vehicle->id, [
            'removed_at' => now()->toDateString(),
        ]);
        $contract->vehicles()->detach($vehicle->id);

        return back()->with('success', 'Vehículo removido del contrato.');
    }

    private function authorizeContract(Contract $contract): void
    {
        $user = auth()->user();
        if (! $user->isSuperAdmin() && $contract->company_id !== $user->company_id) {
            abort(403);
        }
    }
}
