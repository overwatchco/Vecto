<?php

namespace App\Http\Controllers\Fleet;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\MaterialMovement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MaterialController extends Controller
{
    private function scope()
    {
        $user = auth()->user();

        return $user->isSuperAdmin()
            ? Material::query()
            : Material::where('company_id', $user->company_id);
    }

    public function index(): Response
    {
        $materials = $this->scope()
            ->orderBy('name')
            ->get()
            ->map(fn (Material $m) => [
                'id'                 => $m->id,
                'name'               => $m->name,
                'reference'          => $m->reference,
                'unit'               => $m->unit,
                'unit_cost'          => $m->unit_cost,
                'stock'              => $m->stock,
                'min_stock'          => $m->min_stock,
                'provider'           => $m->provider,
                'warehouse_location' => $m->warehouse_location,
                'is_low_stock'       => $m->isLowStock(),
                'is_active'          => $m->is_active,
                'total_value'        => (float) $m->stock * (float) $m->unit_cost,
            ]);

        return Inertia::render('fleet/materials/index', [
            'materials'       => $materials,
            'low_stock_count' => $materials->where('is_low_stock', true)->count(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('fleet/materials/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name'               => 'required|string|max:100',
            'reference'          => 'nullable|string|max:50',
            'unit'               => 'required|string|max:20',
            'unit_cost'          => 'nullable|numeric|min:0',
            'stock'              => 'nullable|numeric|min:0',
            'min_stock'          => 'nullable|numeric|min:0',
            'provider'           => 'nullable|string|max:100',
            'warehouse_location' => 'nullable|string|max:100',
        ]);

        $data['company_id'] = auth()->user()->company_id;

        Material::create($data);

        return redirect()->route('fleet.materials.index')
            ->with('success', 'Material registrado correctamente.');
    }

    public function edit(Material $material): Response
    {
        $this->authorizeMaterial($material);

        return Inertia::render('fleet/materials/edit', [
            'material' => $material,
        ]);
    }

    public function update(Request $request, Material $material): RedirectResponse
    {
        $this->authorizeMaterial($material);

        $data = $request->validate([
            'name'               => 'required|string|max:100',
            'reference'          => 'nullable|string|max:50',
            'unit'               => 'required|string|max:20',
            'unit_cost'          => 'nullable|numeric|min:0',
            'min_stock'          => 'nullable|numeric|min:0',
            'provider'           => 'nullable|string|max:100',
            'warehouse_location' => 'nullable|string|max:100',
            'is_active'          => 'boolean',
        ]);

        $material->update($data);

        return redirect()->route('fleet.materials.index')
            ->with('success', 'Material actualizado correctamente.');
    }

    public function destroy(Material $material): RedirectResponse
    {
        $this->authorizeMaterial($material);
        $material->delete();

        return redirect()->route('fleet.materials.index')
            ->with('success', 'Material eliminado.');
    }

    /** Registrar movimiento de entrada/salida */
    public function movement(Request $request, Material $material): RedirectResponse
    {
        $this->authorizeMaterial($material);

        $data = $request->validate([
            'type'           => 'required|in:in,out',
            'quantity'       => 'required|numeric|min:0.01',
            'unit_cost'      => 'nullable|numeric|min:0',
            'reason'         => 'nullable|string|max:200',
            'date'           => 'required|date',
            'maintenance_id' => 'nullable|exists:maintenances,id',
        ]);

        if ($data['type'] === 'out' && $material->stock < $data['quantity']) {
            return back()->withErrors(['quantity' => 'Stock insuficiente.']);
        }

        MaterialMovement::create(array_merge($data, [
            'material_id' => $material->id,
            'user_id'     => auth()->id(),
            'unit_cost'   => $data['unit_cost'] ?? $material->unit_cost,
        ]));

        $delta = $data['type'] === 'in' ? $data['quantity'] : -$data['quantity'];
        $material->increment('stock', $delta);

        return back()->with('success', 'Movimiento registrado.');
    }

    public function showMovements(Material $material): Response
    {
        $this->authorizeMaterial($material);

        $movements = $material->movements()
            ->with('user:id,name', 'maintenance:id,description')
            ->orderByDesc('date')
            ->get();

        return Inertia::render('fleet/materials/movements', [
            'material'  => $material,
            'movements' => $movements,
        ]);
    }

    private function authorizeMaterial(Material $material): void
    {
        $user = auth()->user();
        if (! $user->isSuperAdmin() && $material->company_id !== $user->company_id) {
            abort(403);
        }
    }
}
