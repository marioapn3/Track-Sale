<?php

namespace App\Modules\Product\Services\Api;

use App\Helpers\ImageUploader;
use App\Helpers\PaginationHelper;
use App\Modules\Base\DTOs\PaginationDTO;
use App\Modules\Product\DTOs\ProductDTO;
use App\Modules\Product\Models\Product;
use Illuminate\Support\Str;

class ApiProductService
{
    public function getProductsPagination(
        PaginationDTO $dto
    ) {
        $products = Product::query()
            ->when($dto->search, function ($query) use ($dto) {
                $query->where(function ($q) use ($dto) {
                    $q->where('name', 'like', '%'.$dto->search.'%')
                        ->orWhere('sku', 'like', '%'.$dto->search.'%')
                        ->orWhere('brand', 'like', '%'.$dto->search.'%');
                });
            })
            ->when($dto->sort, function ($query) use ($dto) {
                $query->orderBy($dto->sort_by, $dto->sort_direction);
            }, function ($query) {
                $query->latest();
            })
            ->paginate($dto->per_page, ['*'], 'page', $dto->page);

        return PaginationHelper::format($products);
    }

    public function createProduct(ProductDTO $dto)
    {
        $imagePath = null;
        if ($dto->image) {
            $imagePath = ImageUploader::upload($dto->image, 'products');
        }

        $slug = Str::slug($dto->name);
        $uniqueSlug = $slug;
        $counter = 1;
        while (Product::where('slug', $uniqueSlug)->exists()) {
            $uniqueSlug = $slug.'-'.$counter;
            $counter++;
        }

        $product = Product::create([
            'name' => $dto->name,
            'sku' => $dto->sku,
            'stock' => $dto->stock,
            'price' => $dto->price,
            'image' => $imagePath,
            'slug' => $uniqueSlug,
            'unit' => $dto->unit,
            'is_active' => $dto->is_active,
            'brand' => $dto->brand,
            'description' => $dto->description,
        ]);

        return $product;
    }

    public function updateProduct($id, ProductDTO $dto)
    {
        $product = Product::find($id);
        if (! $product) {
            throw new \Exception('Product not found', 404);
        }

        $imagePath = $product->image;
        if ($dto->image) {
            if ($product->image) {
                ImageUploader::delete($product->image);
            }
            $imagePath = ImageUploader::upload($dto->image, 'products');
        }

        $slug = Str::slug($dto->name);
        $uniqueSlug = $slug;
        $counter = 1;
        while (Product::where('slug', $uniqueSlug)->where('id', '!=', $id)->exists()) {
            $uniqueSlug = $slug.'-'.$counter;
            $counter++;
        }

        $product->update([
            'name' => $dto->name,
            'sku' => $dto->sku,
            'stock' => $dto->stock,
            'price' => $dto->price,
            'image' => $imagePath,
            'slug' => $uniqueSlug,
            'unit' => $dto->unit,
            'is_active' => $dto->is_active,
            'brand' => $dto->brand,
            'description' => $dto->description,
        ]);

        return $product;
    }

    public function deleteProduct($id)
    {
        $product = Product::find($id);
        if (! $product) {
            throw new \Exception('Product not found', 404);
        }

        if ($product->image) {
            ImageUploader::delete($product->image);
        }

        $product->delete();

        return $product;
    }

    public function getAllProducts()
    {
        return Product::where('is_active', true)->get();
    }

    public function getProductById($id)
    {
        $product = Product::find($id);
        if (! $product) {
            throw new \Exception('Product not found', 404);
        }

        return $product;
    }
}
