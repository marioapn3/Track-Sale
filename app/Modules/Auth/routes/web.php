<?php

use App\Common\Enums\RouteEnums;
use Illuminate\Support\Facades\Route;
use App\Modules\Auth\Controllers\Web\AuthController;

// Route::prefix('auth')->name('auth.')->group(function () {
// Route::get('/', [AuthController::class, 'index'])->name('index');
// Route::get('/{id}', [AuthController::class, 'show'])->name('show');
// });

Route::controller(AuthController::class)->group(function () {
    Route::get('/login', 'loginView')->name(RouteEnums::LOGIN_VIEW->value);
    Route::post('/login', 'loginPost')->name(RouteEnums::LOGIN_POST->value);
});
