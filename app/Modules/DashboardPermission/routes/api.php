<?php

use Illuminate\Support\Facades\Route;
use App\Modules\DashboardPermission\Controllers\Api\ApiDashboardPermissionController;

Route::prefix('dashboard-permission')->name('dashboard-permission.')->group(function () {
    // Route::get('/', [ApiDashboardPermissionController::class, 'index'])->name('index');
    // Route::get('/{id}', [ApiDashboardPermissionController::class, 'show'])->name('show');
});