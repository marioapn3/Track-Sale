<?php

use App\Modules\Auth\Controllers\Api\ApiAuthController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::prefix('auth')->name('auth.')->group(function () {
        Route::controller(ApiAuthController::class)->group(function () {
            Route::post('/register', 'register')->name('register');
            Route::post('/login', 'login')->name('login');
        });
    });
});
