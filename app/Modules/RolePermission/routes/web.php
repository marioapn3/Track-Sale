<?php

use App\Common\Enums\RouteEnums;
use Illuminate\Support\Facades\Route;
use App\Modules\RolePermission\Controllers\Web\RolePermissionController;



Route::prefix('dashboard')->group(function () {
    Route::controller(RolePermissionController::class)->group(function () {
        Route::get('/role-permissions', 'index')->name(RouteEnums::ROLE_PERMISSION_GET_ROLES_PAGINATION->value);
    });
});
