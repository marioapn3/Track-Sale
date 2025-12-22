<?php

use App\Common\Enums\RouteEnums;
use App\Modules\Sales\Controllers\Api\ApiSalesController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::prefix('sales')->name('sales.')->group(function () {
        Route::controller(ApiSalesController::class)->group(function () {
            Route::get('/', 'getSalesPagination')->name(RouteEnums::SALES_GET_SALES_PAGINATION->value);
            Route::post('/', 'createSales')->name(RouteEnums::SALES_CREATE_SALES->value);
            Route::get('/all', 'getAllSales')->name(RouteEnums::SALES_GET_ALL_SALES->value);
            Route::get('/{id}', 'getSalesById')->name(RouteEnums::SALES_GET_SALES_BY_ID->value);
            Route::match(['put', 'post'], '/{id}', 'updateSales')->name(RouteEnums::SALES_UPDATE_SALES->value);
            Route::delete('/{id}', 'deleteSales')->name(RouteEnums::SALES_DELETE_SALES->value);
        });
    });
});
