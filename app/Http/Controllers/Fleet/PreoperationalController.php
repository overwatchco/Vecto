<?php

namespace App\Http\Controllers\Fleet;

use App\Http\Controllers\Controller;
use App\Models\PreoperationalInspection;
use App\Models\PreoperationalItem;
use App\Models\PreoperationalResponse;
use App\Models\Vehicle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PreoperationalController extends Controller
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

        $inspections = PreoperationalInspection::whereIn('vehicle_id', $vehicleIds)
            ->with('vehicle:id,plate,brand,model', 'inspector:id,name')
            ->orderByDesc('inspected_at')
            ->limit(100)
            ->get()
            ->map(fn (PreoperationalInspection $i) => [
                'id'             => $i->id,
                'vehicle_label'  => $i->vehicle ? "{$i->vehicle->brand} {$i->vehicle->model} — {$i->vehicle->plate}" : '',
                'inspector_name' => $i->inspector?->name,
                'result'         => $i->result,
                'odometer'       => $i->odometer,
                'inspected_at'   => $i->inspected_at?->format('d/m/Y H:i'),
                'observations'   => $i->observations,
            ]);

        return Inertia::render('fleet/preoperational/index', [
            'inspections' => $inspections,
        ]);
    }

    public function create(Request $request): Response
    {
        $vehicleId = $request->query('vehicle_id');

        $vehicles = $this->vehicleScope()->where('status', 'active')
            ->orderBy('plate')
            ->get(['id', 'plate', 'brand', 'model'])
            ->map(fn ($v) => ['value' => $v->id, 'label' => "{$v->brand} {$v->model} — {$v->plate}"]);

        $companyId = auth()->user()->isSuperAdmin()
            ? ($request->query('company_id') ?? auth()->user()->company_id)
            : auth()->user()->company_id;

        $items = PreoperationalItem::where('company_id', $companyId)
            ->where('is_active', true)
            ->orderBy('category')
            ->orderBy('sort_order')
            ->get(['id', 'category', 'name', 'is_required']);

        return Inertia::render('fleet/preoperational/create', [
            'vehicles'   => $vehicles,
            'items'      => $items,
            'vehicle_id' => $vehicleId ? (int) $vehicleId : null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'vehicle_id'   => 'required|exists:vehicles,id',
            'odometer'     => 'nullable|integer|min:0',
            'observations' => 'nullable|string',
            'responses'    => 'required|array',
            'responses.*.item_id' => 'required|exists:preoperational_items,id',
            'responses.*.value'   => 'required|in:ok,fail,na',
            'responses.*.note'    => 'nullable|string',
        ]);

        $vehicle = Vehicle::findOrFail($data['vehicle_id']);
        $user    = auth()->user();
        if (! $user->isSuperAdmin() && $vehicle->company_id !== $user->company_id) {
            abort(403);
        }

        $hasFail = collect($data['responses'])->contains('value', 'fail');
        $result  = $hasFail ? 'unfit' : (
            $request->observations ? 'fit_with_observations' : 'fit'
        );

        $inspection = PreoperationalInspection::create([
            'vehicle_id'   => $data['vehicle_id'],
            'inspector_id' => $user->id,
            'result'       => $result,
            'observations' => $data['observations'] ?? null,
            'odometer'     => $data['odometer'] ?? null,
            'inspected_at' => now(),
        ]);

        foreach ($data['responses'] as $response) {
            PreoperationalResponse::create([
                'inspection_id' => $inspection->id,
                'item_id'       => $response['item_id'],
                'value'         => $response['value'],
                'note'          => $response['note'] ?? null,
            ]);
        }

        return redirect()->route('fleet.preoperational.index')
            ->with('success', 'Inspección preoperacional registrada.');
    }

    public function show(PreoperationalInspection $preoperational): Response
    {
        $user = auth()->user();
        if (! $user->isSuperAdmin() && $preoperational->vehicle->company_id !== $user->company_id) {
            abort(403);
        }

        $preoperational->load('vehicle', 'inspector', 'responses.item');

        return Inertia::render('fleet/preoperational/show', [
            'inspection' => $preoperational,
        ]);
    }

    /** Configurar checklist de la empresa */
    public function items(): Response
    {
        abort_if(! auth()->user()->isAdmin(), 403);

        $items = PreoperationalItem::where('company_id', auth()->user()->company_id)
            ->orderBy('category')
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('fleet/preoperational/items', [
            'items' => $items,
        ]);
    }

    public function storeItem(Request $request): RedirectResponse
    {
        abort_if(! auth()->user()->isAdmin(), 403);

        $data = $request->validate([
            'category'    => 'required|string|max:50',
            'name'        => 'required|string|max:100',
            'is_required' => 'boolean',
            'sort_order'  => 'integer|min:0',
        ]);

        $data['company_id'] = auth()->user()->company_id;

        PreoperationalItem::create($data);

        return back()->with('success', 'Ítem agregado al checklist.');
    }

    public function destroyItem(PreoperationalItem $item): RedirectResponse
    {
        abort_if(! auth()->user()->isAdmin(), 403);
        abort_if($item->company_id !== auth()->user()->company_id, 403);

        $item->delete();

        return back()->with('success', 'Ítem eliminado.');
    }
}
