<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class MakeModuleMigration extends Command
{
    protected $signature = 'make:module-migration {module} {name} {--create=} {--table=}';

    protected $description = 'Create a new migration file for a specific module';

    public function handle(): int
    {
        $moduleName = Str::studly($this->argument('module'));
        $migrationName = $this->argument('name');
        $modulePath = app_path("Modules/{$moduleName}");

        if (! File::exists($modulePath)) {
            $this->error("Module {$moduleName} does not exist!");

            return self::FAILURE;
        }

        $migrationsPath = "{$modulePath}/database/migrations";

        if (! File::exists($migrationsPath)) {
            File::makeDirectory($migrationsPath, recursive: true);
        }

        $options = [
            '--path' => realpath($migrationsPath),
            '--realpath' => true,
            '--no-interaction' => true,
        ];

        $createTable = $this->option('create');
        $modifyTable = $this->option('table');

        // Auto-detect table name from migration name if not provided
        if (! $createTable && ! $modifyTable) {
            if (preg_match('/create[_\s]+(\w+?)[_\s]*table$/i', $migrationName, $matches)) {
                $createTable = Str::snake($matches[1]);
            } elseif (preg_match('/(?:add|modify|alter|update)[_\s]+.*[_\s]+to[_\s]+(\w+)[_\s]*table/i', $migrationName, $matches)) {
                $modifyTable = Str::snake($matches[1]);
            } elseif (preg_match('/^create[_\s]+(\w+)$/i', $migrationName, $matches)) {
                $createTable = Str::snake(Str::plural($matches[1]));
            } elseif (preg_match('/^(\w+)$/i', $migrationName, $matches) && ! str_contains(strtolower($migrationName), 'table')) {
                // If migration name is just a single word (like "Sales"), assume it's creating a table
                $createTable = Str::snake(Str::plural($matches[1]));
            }
        }

        if ($createTable) {
            $options['--create'] = $createTable;
        } elseif ($modifyTable) {
            $options['--table'] = $modifyTable;
        }

        $this->call('make:migration', array_merge([
            'name' => $migrationName,
        ], $options));

        // Find the created migration file and ensure it has schema
        $migrationFiles = File::glob("{$migrationsPath}/*{$migrationName}.php");
        if (! empty($migrationFiles)) {
            $migrationFile = $migrationFiles[0];
            $content = File::get($migrationFile);

            // If migration is empty, add schema
            if (str_contains($content, '//') && ! str_contains($content, 'Schema::')) {
                $tableName = $createTable ?? $modifyTable ?? Str::snake(Str::plural($migrationName));

                if ($createTable) {
                    $upContent = "Schema::create('{$createTable}', function (Blueprint \$table) {\n            \$table->id();\n            \$table->timestamps();\n        });";
                    $downContent = "Schema::dropIfExists('{$createTable}');";
                } elseif ($modifyTable) {
                    $upContent = "Schema::table('{$modifyTable}', function (Blueprint \$table) {\n            //\n        });";
                    $downContent = '//';
                } else {
                    $upContent = "Schema::create('{$tableName}', function (Blueprint \$table) {\n            \$table->id();\n            \$table->timestamps();\n        });";
                    $downContent = "Schema::dropIfExists('{$tableName}');";
                }

                $content = str_replace(
                    "public function up(): void\n    {\n        //\n    }",
                    "public function up(): void\n    {\n        {$upContent}\n    }",
                    $content
                );

                $content = str_replace(
                    "public function down(): void\n    {\n        //\n    }",
                    "public function down(): void\n    {\n        {$downContent}\n    }",
                    $content
                );

                File::put($migrationFile, $content);
            }
        }

        $this->info("Migration created successfully in module {$moduleName}!");

        return self::SUCCESS;
    }
}
