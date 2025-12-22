<?php

namespace App\Modules\Product\DTOs;

use App\Modules\Product\Requests\ProductRequest;
use Illuminate\Http\UploadedFile;

class ProductDTO
{
    private function __construct(
        public readonly string $name,
        public readonly string $sku,
        public readonly int $stock,
        public readonly float $price,
        public readonly ?UploadedFile $image,
        public readonly string $unit,
        public readonly bool $is_active,
        public readonly ?string $brand,
        public readonly ?string $description,
    ) {}

    public static function fromRequest(
        ProductRequest $request
    ): self {
        return new self(
            name: $request->name,
            sku: $request->sku,
            stock: $request->stock,
            price: $request->price,
            image: $request->file('image'),
            unit: $request->unit,
            is_active: $request->is_active ?? true,
            brand: $request->brand,
            description: $request->description,
        );
    }
}
