<?php

use App\Common\Enums\RouteEnums;
use App\Modules\Product\Controllers\Web\ProductController;
use Illuminate\Support\Facades\Route;

Route::prefix('dashboard')->group(function () {
    Route::controller(ProductController::class)->prefix('product')->group(function () {
        Route::get('/', 'index')->name(RouteEnums::PRODUCT_INDEX->value);
        Route::get('/create', 'create')->name(RouteEnums::PRODUCT_CREATE->value);
        Route::get('/{id}/edit', 'edit')->name(RouteEnums::PRODUCT_EDIT->value);
    });
});
