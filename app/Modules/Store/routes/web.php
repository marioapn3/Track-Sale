<?php

use App\Modules\Store\Controllers\Web\StoreController;
use Illuminate\Support\Facades\Route;

Route::prefix('store')->name('store.')->group(function () {
    // Route::get('/', [StoreController::class, 'index'])->name('index');
    // Route::get('/{id}', [StoreController::class, 'show'])->name('show');
});
