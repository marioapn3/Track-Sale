<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class MakeModuleModel extends Command
{
    protected $signature = 'make:module-model {module} {name}';

    protected $description = 'Create a new model for a specific module';

    public function handle(): int
    {
        $moduleName = Str::studly($this->argument('module'));
        $modelName = Str::studly($this->argument('name'));
        $modulePath = app_path("Modules/{$moduleName}");

        if (! File::exists($modulePath)) {
            $this->error("Module {$moduleName} does not exist!");

            return self::FAILURE;
        }

        $modelsPath = "{$modulePath}/Models";

        if (! File::exists($modelsPath)) {
            File::makeDirectory($modelsPath, recursive: true);
        }

        $modelFile = "{$modelsPath}/{$modelName}.php";

        if (File::exists($modelFile)) {
            $this->error("Model {$modelName} already exists in module {$moduleName}!");

            return self::FAILURE;
        }

        $tableName = Str::snake(Str::plural($modelName));

        $modelContent = <<<PHP
<?php

namespace App\Modules\\{$moduleName}\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class {$modelName} extends Model
{
    use HasFactory;

    protected \$table = '{$tableName}';

    protected \$fillable = [
        //
    ];
}
PHP;

        File::put($modelFile, $modelContent);

        $this->info("Model {$modelName} created successfully in module {$moduleName}!");

        return self::SUCCESS;
    }
}
