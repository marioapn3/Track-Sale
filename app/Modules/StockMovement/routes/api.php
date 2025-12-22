<?php

use App\Common\Enums\RouteEnums;
use App\Modules\StockMovement\Controllers\Api\ApiStockMovementController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::prefix('stock-movement')->name('stock-movement.')->group(function () {
        Route::controller(ApiStockMovementController::class)->group(function () {
            Route::get('/', 'getStockMovementsPagination')->name(RouteEnums::STOCK_MOVEMENT_GET_STOCK_MOVEMENTS_PAGINATION->value);
            Route::get('/product/{productSlug}', 'getStockMovementsByProductSlug')->name(RouteEnums::STOCK_MOVEMENT_GET_STOCK_MOVEMENTS_BY_PRODUCT_SLUG->value);
            Route::post('/', 'createStockMovement')->name(RouteEnums::STOCK_MOVEMENT_CREATE_STOCK_MOVEMENT->value);
            Route::get('/all', 'getAllStockMovements')->name(RouteEnums::STOCK_MOVEMENT_GET_ALL_STOCK_MOVEMENTS->value);
            Route::get('/{id}', 'getStockMovementById')->name(RouteEnums::STOCK_MOVEMENT_GET_STOCK_MOVEMENT_BY_ID->value);
            Route::match(['put', 'post'], '/{id}', 'updateStockMovement')->name(RouteEnums::STOCK_MOVEMENT_UPDATE_STOCK_MOVEMENT->value);
            Route::delete('/{id}', 'deleteStockMovement')->name(RouteEnums::STOCK_MOVEMENT_DELETE_STOCK_MOVEMENT->value);
        });
    });
});
