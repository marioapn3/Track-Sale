<?php

namespace App\Modules\RolePermission\Services\Api;

use Spatie\Permission\Models\Permission;

class ApiPermissionService
{
    public function getPermissions()
    {
        return Permission::all();
    }

    // public function 
}
