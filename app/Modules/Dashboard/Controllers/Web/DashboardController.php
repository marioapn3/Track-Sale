<?php

namespace App\Modules\Dashboard\Controllers\Web;

use App\Common\Enums\ViewEnums;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function homeView()
    {
        return Inertia::render(ViewEnums::DASHBOARD_HOME->value);
    }
}