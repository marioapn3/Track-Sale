<?php

namespace App\Modules\RolePermission\Controllers\Web;

use App\Common\Enums\ViewEnums;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class RolePermissionController extends Controller
{
    public function index()
    {
        return Inertia::render(ViewEnums::ROLE_PERMISSION_INDEX->value);
    }
}
