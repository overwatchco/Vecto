<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => view('landing'))->name('landing');

// ─── Panel Operador / cualquier usuario autenticado ──────────────────────────
Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource('users', UserController::class)->except(['show']);
});

// ─── Panel Admin de Empresa ──────────────────────────────────────────────────
Route::prefix('empresa')
    ->middleware(['auth', 'verified', 'role:company_admin,superadmin'])
    ->name('empresa.')
    ->group(function () {
        Route::inertia('dashboard', 'empresa/dashboard')->name('dashboard');
    });

// ─── Panel Superadmin ────────────────────────────────────────────────────────
Route::prefix('admin')
    ->middleware(['auth', 'verified', 'role:superadmin'])
    ->name('admin.')
    ->group(function () {
        Route::inertia('dashboard', 'admin/dashboard')->name('dashboard');
    });

require __DIR__.'/settings.php';
require __DIR__.'/fleet.php';
