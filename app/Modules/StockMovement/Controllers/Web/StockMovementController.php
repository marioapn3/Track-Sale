<?php

namespace App\Modules\StockMovement\Controllers\Web;

use App\Common\Enums\ViewEnums;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class StockMovementController extends Controller
{
    public function index($productSlug)
    {
        return Inertia::render(ViewEnums::STOCK_MOVEMENT_INDEX->value, [
            'productSlug' => $productSlug,
        ]);
    }
}
