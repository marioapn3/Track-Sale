<?php

namespace App\Modules\Sales\Controllers\Web;

use App\Common\Enums\ViewEnums;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class SalesController extends Controller
{
    public function index()
    {
        return Inertia::render(ViewEnums::SALES_INDEX->value);
    }

    public function create()
    {
        return Inertia::render(ViewEnums::SALES_CREATE->value);
    }

    public function edit($id)
    {
        return Inertia::render(ViewEnums::SALES_EDIT->value, [
            'id' => $id,
        ]);
    }
}
