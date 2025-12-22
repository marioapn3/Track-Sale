<?php

use App\Modules\User\Controllers\Api\ApiUserController;
use App\Modules\User\Models\User;
use Illuminate\Support\Facades\Route;

// Route::prefix('user')->name('user.')->group(function () {
//     // Route::get('/', [ApiUserController::class, 'index'])->name('index');
//     // Route::get('/{id}', [ApiUserController::class, 'show'])->name('show');
// });

// Only For Testing Api

Route::get('/users/{id}', function ($id) {
    return response()->json([
        'message' => 'Dummy users fetched successfully',
        'data' => User::find($id),
    ]);
});
