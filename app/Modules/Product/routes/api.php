<?php

use App\Common\Enums\RouteEnums;
use App\Modules\Product\Controllers\Api\ApiProductController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::prefix('product')->name('product.')->group(function () {
        Route::controller(ApiProductController::class)->group(function () {
            Route::get('/', 'getProductsPagination')->name(RouteEnums::PRODUCT_GET_PRODUCTS_PAGINATION->value);
            Route::post('/', 'createProduct')->name(RouteEnums::PRODUCT_CREATE_PRODUCT->value);
            Route::get('/all', 'getAllProducts')->name(RouteEnums::PRODUCT_GET_ALL_PRODUCTS->value);
            Route::get('/{id}', 'getProductById')->name(RouteEnums::PRODUCT_GET_PRODUCT_BY_ID->value);
            Route::match(['put', 'post'], '/{id}', 'updateProduct')->name(RouteEnums::PRODUCT_UPDATE_PRODUCT->value);
            Route::delete('/{id}', 'deleteProduct')->name(RouteEnums::PRODUCT_DELETE_PRODUCT->value);
        });
    });
});
