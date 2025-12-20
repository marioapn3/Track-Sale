<?php

namespace App\Modules\Auth\Services\Web;

use App\Modules\Auth\DTOs\LoginDTO;
use App\Modules\User\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    public function login(LoginDTO $dto): array
    {
        $user = User::where('email', $dto->email)->first();
        if (!$user) {
            throw new \Exception('User not found');
        }
        if (!Hash::check($dto->password, $user->password)) {
            throw new \Exception('Invalid credentials');
        }
        return $user;
    }
}
