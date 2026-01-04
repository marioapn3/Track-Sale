<?php

use App\Common\Enums\RouteEnums;
use App\Modules\Dashboard\Controllers\Web\DashboardController;
use Illuminate\Support\Facades\Route;

Route::controller(DashboardController::class)->prefix('dashboard')->group(function () {
    Route::get('/', 'homeView')->name(RouteEnums::DASHBOARD_HOME_VIEW->value);
});
