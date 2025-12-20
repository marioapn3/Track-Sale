<?php

use App\Common\Enums\RouteEnums;
use App\Modules\RolePermission\Controllers\Api\ApiRoleController;
use Illuminate\Support\Facades\Route;
use App\Modules\RolePermission\Controllers\Api\ApiRolePermissionController;

Route::prefix('v1')->group(function () {
    Route::prefix('role-permission')->name('role-permission.')->group(function () {
        Route::controller(ApiRoleController::class)->group(function () {
            Route::get('/roles', 'getRolesPagination')->name(RouteEnums::ROLE_PERMISSION_GET_ROLES_PAGINATION->value);
            Route::post('/roles', 'createRole')->name(RouteEnums::ROLE_PERMISSION_CREATE_ROLE->value);
            Route::put('/roles/{id}', 'updateRole')->name(RouteEnums::ROLE_PERMISSION_UPDATE_ROLE->value);
            Route::delete('/roles/{id}', 'deleteRole')->name(RouteEnums::ROLE_PERMISSION_DELETE_ROLE->value);
            Route::get('/roles/all', 'getAllRoles')->name(RouteEnums::ROLE_PERMISSION_GET_ALL_ROLES->value);
        });
    });
});
