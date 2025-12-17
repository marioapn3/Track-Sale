<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class MakeModule extends Command
{
    protected $signature = 'make:module {name}';

    protected $description = 'Create a new module';

    public function handle(): int
    {
        $name = $this->argument('name');
        $moduleName = Str::studly($name);
        $modulePath = app_path("Modules/{$moduleName}");

        if (File::exists($modulePath)) {
            $this->error("Module {$moduleName} already exists!");

            return self::FAILURE;
        }

        // Create directories
        File::makeDirectory($modulePath, recursive: true);
        File::makeDirectory("{$modulePath}/Controllers", recursive: true);
        File::makeDirectory("{$modulePath}/Services", recursive: true);
        File::makeDirectory("{$modulePath}/Models", recursive: true);
        File::makeDirectory("{$modulePath}/routes", recursive: true);
        File::makeDirectory("{$modulePath}/database/migrations", recursive: true);

        // Generate Controller
        $this->createController($modulePath, $moduleName);

        // Generate Service
        $this->createService($modulePath, $moduleName);

        // Generate Model
        $this->createModel($modulePath, $moduleName);

        // Generate routes
        $this->createWebRoutes($modulePath, $moduleName);
        $this->createApiRoutes($modulePath, $moduleName);

        $this->info("Module {$moduleName} created successfully!");

        return self::SUCCESS;
    }

    protected function createController(string $modulePath, string $moduleName): void
    {
        $controllerContent = <<<PHP
<?php

namespace App\Modules\\{$moduleName}\Controllers;

use App\Http\Controllers\Controller;

class {$moduleName}Controller extends Controller
{
    //
}
PHP;

        File::put("{$modulePath}/Controllers/{$moduleName}Controller.php", $controllerContent);
    }

    protected function createService(string $modulePath, string $moduleName): void
    {
        $serviceContent = <<<PHP
<?php

namespace App\Modules\\{$moduleName}\Services;

class {$moduleName}Service
{
    //
}
PHP;

        File::put("{$modulePath}/Services/{$moduleName}Service.php", $serviceContent);
    }

    protected function createModel(string $modulePath, string $moduleName): void
    {
        $tableName = Str::snake(Str::plural($moduleName));
        $modelContent = <<<PHP
<?php

namespace App\Modules\\{$moduleName}\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class {$moduleName} extends Model
{
    use HasFactory;

    protected \$table = '{$tableName}';

    protected \$fillable = [
        //
    ];
}
PHP;

        File::put("{$modulePath}/Models/{$moduleName}.php", $modelContent);
    }

    protected function createWebRoutes(string $modulePath, string $moduleName): void
    {
        $moduleNameLower = Str::kebab($moduleName);
        $routesContent = <<<PHP
<?php

use Illuminate\Support\Facades\Route;
use App\Modules\\{$moduleName}\Controllers\\{$moduleName}Controller;

Route::prefix('{$moduleNameLower}')->name('{$moduleNameLower}.')->group(function () {
    // Route::get('/', [{$moduleName}Controller::class, 'index'])->name('index');
    // Route::get('/{id}', [{$moduleName}Controller::class, 'show'])->name('show');
});
PHP;

        File::put("{$modulePath}/routes/web.php", $routesContent);
    }

    protected function createApiRoutes(string $modulePath, string $moduleName): void
    {
        $moduleNameLower = Str::kebab($moduleName);
        $routesContent = <<<PHP
<?php

use Illuminate\Support\Facades\Route;
use App\Modules\\{$moduleName}\Controllers\\{$moduleName}Controller;

Route::prefix('{$moduleNameLower}')->name('{$moduleNameLower}.')->group(function () {
    // Route::get('/', [{$moduleName}Controller::class, 'index'])->name('index');
    // Route::get('/{id}', [{$moduleName}Controller::class, 'show'])->name('show');
});
PHP;

        File::put("{$modulePath}/routes/api.php", $routesContent);
    }
}
