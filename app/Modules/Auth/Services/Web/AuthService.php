<?php

namespace App\Modules\Auth\Services\Web;

use App\Modules\Auth\DTOs\LoginDTO;
use Illuminate\Support\Facades\Auth;

class AuthService
{
    public function login(LoginDTO $dto): bool
    {
        $credentials = [
            'email' => $dto->email,
            'password' => $dto->password,
        ];

        if (! Auth::attempt($credentials)) {
            throw new \Exception('Invalid credentials');
        }

        return true;
    }
}
