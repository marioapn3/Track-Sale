<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class MakeModuleResource extends Command
{
    protected $signature = 'make:module-resource {module} {name} {--collection}';

    protected $description = 'Create a new resource for a specific module';

    public function handle(): int
    {
        $moduleName = Str::studly($this->argument('module'));
        $resourceName = Str::studly($this->argument('name'));
        $modulePath = app_path("Modules/{$moduleName}");

        if (! File::exists($modulePath)) {
            $this->error("Module {$moduleName} does not exist!");

            return self::FAILURE;
        }

        $resourcesPath = "{$modulePath}/Resources";

        if (! File::exists($resourcesPath)) {
            File::makeDirectory($resourcesPath, recursive: true);
        }

        // Ensure resource name ends with "Resource"
        if (! str_ends_with($resourceName, 'Resource')) {
            $resourceName .= 'Resource';
        }

        $resourceFile = "{$resourcesPath}/{$resourceName}.php";

        if (File::exists($resourceFile)) {
            $this->error("Resource {$resourceName} already exists in module {$moduleName}!");

            return self::FAILURE;
        }

        if ($this->option('collection')) {
            $resourceContent = <<<PHP
<?php

namespace App\Modules\\{$moduleName}\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class {$resourceName} extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request \$request): array
    {
        return parent::toArray(\$request);
    }
}
PHP;
        } else {
            $resourceContent = <<<PHP
<?php

namespace App\Modules\\{$moduleName}\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class {$resourceName} extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request \$request): array
    {
        return parent::toArray(\$request);
    }
}
PHP;
        }

        File::put($resourceFile, $resourceContent);

        $this->info("Resource {$resourceName} created successfully in module {$moduleName}!");

        return self::SUCCESS;
    }
}
