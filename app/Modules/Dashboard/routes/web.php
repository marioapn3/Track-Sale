<?php

use App\Common\Enums\RouteEnums;
use Illuminate\Support\Facades\Route;
use App\Modules\Dashboard\Controllers\Web\DashboardController;

Route::controller(DashboardController::class)->prefix('dashboard')->group(function () {
    Route::get('/', 'homeView')->name(RouteEnums::DASHBOARD_HOME_VIEW->value);
});