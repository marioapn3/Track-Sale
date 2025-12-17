<?php

namespace App\Providers;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->loadModuleRoutes();
        $this->loadModuleMigrations();
    }

    /**
     * Load routes from all modules.
     */
    protected function loadModuleRoutes(): void
    {
        $modulesPath = app_path('Modules');

        if (! File::exists($modulesPath)) {
            return;
        }

        $modules = File::directories($modulesPath);

        foreach ($modules as $module) {
            $webRoutesFile = "{$module}/routes/web.php";
            if (File::exists($webRoutesFile)) {
                require $webRoutesFile;
            }

            $apiRoutesFile = "{$module}/routes/api.php";
            if (File::exists($apiRoutesFile)) {
                Route::prefix('api')
                    ->name('api.')
                    ->middleware('api')
                    ->group(function () use ($apiRoutesFile) {
                        require $apiRoutesFile;
                    });
            }

            $legacyRoutesFile = "{$module}/routes.php";
            if (File::exists($legacyRoutesFile)) {
                require $legacyRoutesFile;
            }
        }
    }

    /**
     * Load migrations from all modules.
     */
    protected function loadModuleMigrations(): void
    {
        $modulesPath = app_path('Modules');

        if (! File::exists($modulesPath)) {
            return;
        }

        $modules = File::directories($modulesPath);

        foreach ($modules as $module) {
            $migrationsPath = "{$module}/database/migrations";

            if (File::exists($migrationsPath)) {
                $this->loadMigrationsFrom($migrationsPath);
            }
        }
    }
}
