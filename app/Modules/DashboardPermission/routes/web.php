<?php

use Illuminate\Support\Facades\Route;
use App\Modules\DashboardPermission\Controllers\Web\DashboardPermissionController;

Route::prefix('dashboard-permission')->name('dashboard-permission.')->group(function () {
    // Route::get('/', [DashboardPermissionController::class, 'index'])->name('index');
    // Route::get('/{id}', [DashboardPermissionController::class, 'show'])->name('show');
});