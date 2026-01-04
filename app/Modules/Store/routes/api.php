<?php

use App\Common\Enums\RouteEnums;
use App\Modules\Store\Controllers\Api\ApiStoreController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::prefix('store')->name('store.')->group(function () {
        Route::controller(ApiStoreController::class)->group(function () {
            Route::get('/', 'getStoresPagination')->name(RouteEnums::STORE_GET_STORES_PAGINATION->value);
            Route::post('/', 'createStore')->name(RouteEnums::STORE_CREATE_STORE->value);
            Route::get('/all', 'getAllStores')->name(RouteEnums::STORE_GET_ALL_STORES->value);
            Route::get('/{id}', 'getStoreById')->name(RouteEnums::STORE_GET_STORE_BY_ID->value);
            Route::match(['put', 'post'], '/{id}', 'updateStore')->name(RouteEnums::STORE_UPDATE_STORE->value);
            Route::delete('/{id}', 'deleteStore')->name(RouteEnums::STORE_DELETE_STORE->value);
        });
    });
});
