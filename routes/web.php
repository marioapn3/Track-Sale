<?php

use App\Common\Enums\RouteEnums;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route(RouteEnums::LOGIN_VIEW->value);
});
