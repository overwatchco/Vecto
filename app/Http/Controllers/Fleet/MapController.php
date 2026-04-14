<?php

namespace App\Http\Controllers\Fleet;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Models\VehicleLocation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MapController extends Controller
{
    public function index(): Response
    {
        $user    = auth()->user();
        $company = $user->isSuperAdmin() ? null : $user->company;

        return Inertia::render('fleet/map/index', [
            'company' => $company ? ['id' => $company->id, 'name' => $company->name] : null,
        ]);
    }

    public function locations(Request $request): JsonResponse
    {
        $user = auth()->user();

        $query = Vehicle::with('lastLocation')
            ->when(! $user->isSuperAdmin(), fn ($q) => $q->where('company_id', $user->company_id))
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->where('status', '!=', 'inactive');

        $vehicles = $query->get()->map(fn (Vehicle $v) => [
            'id'       => $v->id,
            'plate'    => $v->plate,
            'brand'    => $v->brand,
            'model'    => $v->model,
            'status'   => $v->status,
            'location' => $v->lastLocation ? [
                'lat'         => (float) $v->lastLocation->latitude,
                'lng'         => (float) $v->lastLocation->longitude,
                'address'     => $v->lastLocation->address,
                'speed'       => $v->lastLocation->speed,
                'recorded_at' => $v->lastLocation->recorded_at?->diffForHumans(),
            ] : null,
        ]);

        return response()->json($vehicles);
    }

    public function updateLocation(Request $request, Vehicle $vehicle): JsonResponse
    {
        $user = auth()->user();
        if (! $user->isSuperAdmin() && $vehicle->company_id !== $user->company_id) {
            abort(403);
        }

        $data = $request->validate([
            'latitude'    => 'required|numeric|between:-90,90',
            'longitude'   => 'required|numeric|between:-180,180',
            'address'     => 'nullable|string|max:255',
            'speed'       => 'nullable|numeric|min:0',
            'heading'     => 'nullable|numeric|between:0,360',
            'recorded_at' => 'nullable|date',
        ]);

        $data['recorded_at'] = $data['recorded_at'] ?? now();

        $location = VehicleLocation::create(array_merge($data, ['vehicle_id' => $vehicle->id]));

        return response()->json(['success' => true, 'location' => $location]);
    }
}
