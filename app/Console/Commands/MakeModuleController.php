<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class MakeModuleController extends Command
{
    protected $signature = 'make:module-controller {module} {name} {--api}';

    protected $description = 'Create a new controller for a specific module';

    public function handle(): int
    {
        $moduleName = Str::studly($this->argument('module'));
        $controllerName = Str::studly($this->argument('name'));
        $modulePath = app_path("Modules/{$moduleName}");

        if (! File::exists($modulePath)) {
            $this->error("Module {$moduleName} does not exist!");

            return self::FAILURE;
        }

        $controllersPath = "{$modulePath}/Controllers";

        if (! File::exists($controllersPath)) {
            File::makeDirectory($controllersPath, recursive: true);
        }

        // Ensure controller name ends with "Controller"
        if (! str_ends_with($controllerName, 'Controller')) {
            $controllerName .= 'Controller';
        }

        $controllerFile = "{$controllersPath}/{$controllerName}.php";

        if (File::exists($controllerFile)) {
            $this->error("Controller {$controllerName} already exists in module {$moduleName}!");

            return self::FAILURE;
        }

        if ($this->option('api')) {
            $controllerContent = <<<PHP
<?php

namespace App\Modules\\{$moduleName}\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class {$controllerName} extends Controller
{
    //
}
PHP;
        } else {
            $controllerContent = <<<PHP
<?php

namespace App\Modules\\{$moduleName}\Controllers;

use App\Http\Controllers\Controller;

class {$controllerName} extends Controller
{
    //
}
PHP;
        }

        File::put($controllerFile, $controllerContent);

        $this->info("Controller {$controllerName} created successfully in module {$moduleName}!");

        return self::SUCCESS;
    }
}
