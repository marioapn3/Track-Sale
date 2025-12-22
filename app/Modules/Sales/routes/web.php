<?php

use App\Common\Enums\RouteEnums;
use App\Modules\Sales\Controllers\Web\SalesController;
use Illuminate\Support\Facades\Route;

Route::prefix('dashboard')->group(function () {
    Route::controller(SalesController::class)->prefix('sales')->group(function () {
        Route::get('/', 'index')->name(RouteEnums::SALES_INDEX->value);
        Route::get('/create', 'create')->name(RouteEnums::SALES_CREATE->value);
        Route::get('/{id}/edit', 'edit')->name(RouteEnums::SALES_EDIT->value);
    });
});
