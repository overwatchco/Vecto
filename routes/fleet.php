<?php

use App\Http\Controllers\Fleet\BaseController;
use App\Http\Controllers\Fleet\ContractController;
use App\Http\Controllers\Fleet\CostController;
use App\Http\Controllers\Fleet\MaintenanceController;
use App\Http\Controllers\Fleet\MapController;
use App\Http\Controllers\Fleet\MaterialController;
use App\Http\Controllers\Fleet\PreoperationalController;
use App\Http\Controllers\Fleet\RevenueController;
use App\Http\Controllers\Fleet\VehicleController;
use Illuminate\Support\Facades\Route;

Route::prefix('fleet')
    ->middleware(['auth', 'verified', 'role:operator,company_admin,superadmin'])
    ->name('fleet.')
    ->group(function () {

        // ── M1 Vehículos ────────────────────────────────────────────────
        Route::resource('vehicles', VehicleController::class);

        // ── M2 Mantenimientos ────────────────────────────────────────────
        Route::resource('maintenances', MaintenanceController::class);

        // ── M3 Mapa ──────────────────────────────────────────────────────
        Route::get('map', [MapController::class, 'index'])->name('map.index');
        Route::get('map/locations', [MapController::class, 'locations'])->name('map.locations');
        Route::post('map/{vehicle}/location', [MapController::class, 'updateLocation'])->name('map.update-location');

        // ── M4 Preoperacional ────────────────────────────────────────────
        Route::get('preoperational', [PreoperationalController::class, 'index'])->name('preoperational.index');
        Route::get('preoperational/create', [PreoperationalController::class, 'create'])->name('preoperational.create');
        Route::post('preoperational', [PreoperationalController::class, 'store'])->name('preoperational.store');
        Route::get('preoperational/{preoperational}', [PreoperationalController::class, 'show'])->name('preoperational.show');
        Route::get('preoperational-items', [PreoperationalController::class, 'items'])->name('preoperational.items');
        Route::post('preoperational-items', [PreoperationalController::class, 'storeItem'])->name('preoperational.items.store');
        Route::delete('preoperational-items/{item}', [PreoperationalController::class, 'destroyItem'])->name('preoperational.items.destroy');

        // ── M5 Materiales ────────────────────────────────────────────────
        Route::resource('materials', MaterialController::class)->except(['show']);
        Route::post('materials/{material}/movement', [MaterialController::class, 'movement'])->name('materials.movement');
        Route::get('materials/{material}/movements', [MaterialController::class, 'showMovements'])->name('materials.movements');

        // ── M6/M7 Costos ─────────────────────────────────────────────────
        Route::get('costs', [CostController::class, 'index'])->name('costs.index');
        Route::get('costs/create', [CostController::class, 'create'])->name('costs.create');
        Route::post('costs', [CostController::class, 'store'])->name('costs.store');
        Route::delete('costs/{cost}', [CostController::class, 'destroy'])->name('costs.destroy');
        Route::get('costs/vehicle/{vehicle}', [CostController::class, 'vehicle'])->name('costs.vehicle');

        // ── M8 Ingresos ──────────────────────────────────────────────────
        Route::get('revenues', [RevenueController::class, 'index'])->name('revenues.index');
        Route::get('revenues/create', [RevenueController::class, 'create'])->name('revenues.create');
        Route::post('revenues', [RevenueController::class, 'store'])->name('revenues.store');
        Route::delete('revenues/{revenue}', [RevenueController::class, 'destroy'])->name('revenues.destroy');

        // ── M9 Contratos ─────────────────────────────────────────────────
        Route::resource('contracts', ContractController::class);
        Route::post('contracts/{contract}/vehicles', [ContractController::class, 'assignVehicle'])->name('contracts.vehicles.assign');
        Route::delete('contracts/{contract}/vehicles/{vehicle}', [ContractController::class, 'removeVehicle'])->name('contracts.vehicles.remove');

        // ── M10 Bases ────────────────────────────────────────────────────
        Route::resource('bases', BaseController::class);
        Route::post('bases/{base}/vehicles', [BaseController::class, 'assignVehicle'])->name('bases.vehicles.assign');
        Route::delete('bases/{base}/vehicles/{vehicle}', [BaseController::class, 'removeVehicle'])->name('bases.vehicles.remove');
        Route::post('bases/{base}/operators', [BaseController::class, 'assignOperator'])->name('bases.operators.assign');
        Route::delete('bases/{base}/operators/{user}', [BaseController::class, 'removeOperator'])->name('bases.operators.remove');
    });
