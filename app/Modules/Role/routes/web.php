<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Role\Controllers\Web\RoleController;

Route::prefix('role')->name('role.')->group(function () {
    // Route::get('/', [RoleController::class, 'index'])->name('index');
    // Route::get('/{id}', [RoleController::class, 'show'])->name('show');
});