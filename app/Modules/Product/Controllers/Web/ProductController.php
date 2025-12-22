<?php

namespace App\Modules\Product\Controllers\Web;

use App\Common\Enums\ViewEnums;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        return Inertia::render(ViewEnums::PRODUCT_INDEX->value);
    }

    public function create()
    {
        return Inertia::render(ViewEnums::PRODUCT_CREATE->value);
    }

    public function edit($id)
    {
        return Inertia::render(ViewEnums::PRODUCT_EDIT->value, [
            'id' => $id,
        ]);
    }
}
