<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class MakeModuleService extends Command
{
    protected $signature = 'make:module-service {module} {name}';

    protected $description = 'Create a new service for a specific module';

    public function handle(): int
    {
        $moduleName = Str::studly($this->argument('module'));
        $serviceName = Str::studly($this->argument('name'));
        $modulePath = app_path("Modules/{$moduleName}");

        if (! File::exists($modulePath)) {
            $this->error("Module {$moduleName} does not exist!");

            return self::FAILURE;
        }

        $servicesPath = "{$modulePath}/Services";

        if (! File::exists($servicesPath)) {
            File::makeDirectory($servicesPath, recursive: true);
        }

        $serviceFile = "{$servicesPath}/{$serviceName}Service.php";

        if (File::exists($serviceFile)) {
            $this->error("Service {$serviceName}Service already exists in module {$moduleName}!");

            return self::FAILURE;
        }

        $serviceContent = <<<PHP
<?php

namespace App\Modules\\{$moduleName}\Services;

class {$serviceName}Service
{
    //
}
PHP;

        File::put($serviceFile, $serviceContent);

        $this->info("Service {$serviceName}Service created successfully in module {$moduleName}!");

        return self::SUCCESS;
    }
}
