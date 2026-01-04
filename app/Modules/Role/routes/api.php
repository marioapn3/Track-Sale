<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Role\Controllers\Api\ApiRoleController;

Route::prefix('role')->name('role.')->group(function () {
    // Route::get('/', [ApiRoleController::class, 'index'])->name('index');
    // Route::get('/{id}', [ApiRoleController::class, 'show'])->name('show');
});