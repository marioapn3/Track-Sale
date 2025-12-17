<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class MakeModuleRequest extends Command
{
    protected $signature = 'make:module-request {module} {name}';

    protected $description = 'Create a new form request for a specific module';

    public function handle(): int
    {
        $moduleName = Str::studly($this->argument('module'));
        $requestName = Str::studly($this->argument('name'));
        $modulePath = app_path("Modules/{$moduleName}");

        if (! File::exists($modulePath)) {
            $this->error("Module {$moduleName} does not exist!");

            return self::FAILURE;
        }

        $requestsPath = "{$modulePath}/Requests";

        if (! File::exists($requestsPath)) {
            File::makeDirectory($requestsPath, recursive: true);
        }

        // Ensure request name ends with "Request"
        if (! str_ends_with($requestName, 'Request')) {
            $requestName .= 'Request';
        }

        $requestFile = "{$requestsPath}/{$requestName}.php";

        if (File::exists($requestFile)) {
            $this->error("Request {$requestName} already exists in module {$moduleName}!");

            return self::FAILURE;
        }

        $requestContent = <<<PHP
<?php

namespace App\Modules\\{$moduleName}\Requests;

use Illuminate\Foundation\Http\FormRequest;

class {$requestName} extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            //
        ];
    }
}
PHP;

        File::put($requestFile, $requestContent);

        $this->info("Request {$requestName} created successfully in module {$moduleName}!");

        return self::SUCCESS;
    }
}
