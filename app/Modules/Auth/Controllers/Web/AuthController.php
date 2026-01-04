<?php

namespace App\Modules\Auth\Controllers\Web;

use App\Common\Enums\RouteEnums;
use App\Common\Enums\ViewEnums;
use App\Http\Controllers\Controller;
use App\Modules\Auth\DTOs\LoginDTO;
use App\Modules\Auth\Requests\LoginRequest;
use App\Modules\Auth\Services\Web\AuthService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
    private $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function loginPost(LoginRequest $request)
    {
        try {
            $dto = LoginDTO::fromRequest($request);
            $this->authService->login($dto);

            $request->session()->regenerate();

            return redirect()->route(RouteEnums::DASHBOARD_HOME_VIEW->value);
        } catch (\Exception $e) {
            return back()->withErrors([
                'email' => 'The provided credentials do not match our records.',
            ])->onlyInput('email');
        }
    }

    public function loginView()
    {
        if (Auth::check()) {
            return redirect()->route(RouteEnums::DASHBOARD_HOME_VIEW->value);
        }

        return Inertia::render(ViewEnums::LOGIN->value);
    }
}
