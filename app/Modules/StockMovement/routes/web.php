<?php

use App\Common\Enums\RouteEnums;
use App\Modules\StockMovement\Controllers\Web\StockMovementController;
use Illuminate\Support\Facades\Route;

Route::prefix('dashboard')->group(function () {
    Route::controller(StockMovementController::class)->prefix('stock-movement')->group(function () {
        Route::get('/{productSlug}', 'index')->name(RouteEnums::STOCK_MOVEMENT_INDEX->value);
    });
});
