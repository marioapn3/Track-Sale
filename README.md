# Track Sale

A Laravel application with modular architecture.

## Module Commands

This application includes custom Artisan commands to help you work with modules efficiently.

### Create a New Module

Generate a complete module structure with all necessary files and directories.

```bash
php artisan make:module {name}
```

**Example:**
```bash
php artisan make:module Product
```

This command will create:
- `app/Modules/Product/Controllers/ProductController.php`
- `app/Modules/Product/Services/ProductService.php`
- `app/Modules/Product/Models/Product.php`
- `app/Modules/Product/routes/web.php`
- `app/Modules/Product/routes/api.php`
- `app/Modules/Product/database/migrations/` (directory)

**Module Structure:**
```
app/Modules/Product/
├── Controllers/
│   └── ProductController.php
├── Services/
│   └── ProductService.php
├── Models/
│   └── Product.php
├── Requests/
│   └── StoreProductRequest.php
├── Resources/
│   └── ProductResource.php
├── routes/
│   ├── web.php
│   └── api.php
└── database/
    └── migrations/
```

**Note:** The module name will be automatically converted to StudlyCase (e.g., `product` → `Product`).

### Create Module Model

Generate a model file for a specific module.

```bash
php artisan make:module-model {module} {name}
```

**Example:**
```bash
php artisan make:module-model User Product
```

This will create `app/Modules/User/Models/Product.php` with:
- Proper namespace: `App\Modules\User\Models`
- Table name automatically set to plural snake_case (e.g., `products`)
- `HasFactory` trait included
- `$fillable` array ready for customization

### Create Module Service

Generate a service file for a specific module.

```bash
php artisan make:module-service {module} {name}
```

**Example:**
```bash
php artisan make:module-service User Product
```

This will create `app/Modules/User/Services/ProductService.php` with proper namespace `App\Modules\User\Services`.

**Note:** The service name will automatically have "Service" suffix added (e.g., `Product` → `ProductService`).

### Create Module Controller

Generate a controller file for a specific module.

```bash
php artisan make:module-controller {module} {name} [--api]
```

**Example:**
```bash
# Regular controller
php artisan make:module-controller User Product

# API controller
php artisan make:module-controller User Product --api
```

This will create `app/Modules/User/Controllers/ProductController.php` with:
- Proper namespace: `App\Modules\User\Controllers`
- Extends `App\Http\Controllers\Controller`
- `--api` flag adds `JsonResponse` import for API controllers

**Note:** The controller name will automatically have "Controller" suffix added (e.g., `Product` → `ProductController`).

### Create Module Request

Generate a form request file for a specific module.

```bash
php artisan make:module-request {module} {name}
```

**Example:**
```bash
php artisan make:module-request User StoreProduct
```

This will create `app/Modules/User/Requests/StoreProductRequest.php` with:
- Proper namespace: `App\Modules\User\Requests`
- Extends `Illuminate\Foundation\Http\FormRequest`
- `authorize()` method returning `false` by default
- `rules()` method ready for validation rules

**Note:** The request name will automatically have "Request" suffix added (e.g., `StoreProduct` → `StoreProductRequest`).

### Create Module Resource

Generate an API resource file for a specific module.

```bash
php artisan make:module-resource {module} {name} [--collection]
```

**Example:**
```bash
# Single resource
php artisan make:module-resource User Product

# Resource collection
php artisan make:module-resource User Product --collection
```

This will create `app/Modules/User/Resources/ProductResource.php` with:
- Proper namespace: `App\Modules\User\Resources`
- Extends `JsonResource` (or `ResourceCollection` if `--collection` flag is used)
- `toArray()` method ready for data transformation

**Note:** The resource name will automatically have "Resource" suffix added (e.g., `Product` → `ProductResource`).

### Create Module Migration

Generate a migration file specifically for a module.

```bash
php artisan make:module-migration {module} {name} [options]
```

**Options:**
- `--create=table_name` - Create a new table
- `--table=table_name` - Modify an existing table

**Examples:**

Create a migration to create a new table:
```bash
php artisan make:module-migration Product create_products_table --create=products
```

Create a migration to modify an existing table:
```bash
php artisan make:module-migration Product add_price_to_products_table --table=products
```

Create a simple migration:
```bash
php artisan make:module-migration User create_posts_table
```

**Features:**
- Automatically validates that the module exists
- Creates the `database/migrations` directory if it doesn't exist
- Migrations are stored in `app/Modules/{ModuleName}/database/migrations/`
- Module migrations are automatically loaded by `AppServiceProvider`

## Module Architecture

Modules are automatically loaded by the application:

- **Routes:** Module routes are automatically registered from `routes/web.php` and `routes/api.php`
- **Migrations:** Module migrations are automatically loaded from `database/migrations/`
- **Namespace:** All module classes follow the pattern `App\Modules\{ModuleName}\{Type}`

## Getting Started

1. Create a new module:
   ```bash
   php artisan make:module YourModule
   ```

2. Create migrations for your module:
   ```bash
   php artisan make:module-migration YourModule create_your_table --create=your_table
   ```

3. Create models, services, controllers, requests, and resources:
   ```bash
   # Create a model
   php artisan make:module-model YourModule YourModel

   # Create a service
   php artisan make:module-service YourModule YourService

   # Create a controller
   php artisan make:module-controller YourModule YourController

   # Create a form request
   php artisan make:module-request YourModule StoreYourModel

   # Create an API resource
   php artisan make:module-resource YourModule YourModel
   ```

4. Run migrations:
   ```bash
   php artisan migrate
   ```

5. Start building your module functionality!

