<?php

namespace App\Modules\Auth\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Modules\Auth\DTOs\LoginDTO;
use App\Modules\Auth\Requests\LoginRequest;
use App\Modules\Auth\Services\Web\AuthService;
use App\Common\Enums\RouteEnums;
use App\Common\Enums\ViewEnums;
use Inertia\Inertia;

class AuthController extends Controller
{
    private  $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function loginPost(LoginRequest $request)
    {
        try {
            $dto = LoginDTO::fromRequest($request);
            $this->authService->login($dto);
            return redirect()->route(RouteEnums::DASHBOARD_HOME_VIEW);
        } catch (\Exception $e) {
            return redirect()->route(RouteEnums::LOGIN_VIEW)->with('error', $e->getMessage());
        }
    }

    public function loginView()
    {
        return Inertia::render(ViewEnums::LOGIN->value);
    }
}
