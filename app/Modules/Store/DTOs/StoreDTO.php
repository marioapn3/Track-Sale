<?php

namespace App\Modules\Store\DTOs;

use App\Modules\Store\Requests\StoreRequest;

class StoreDTO
{
    private function __construct(
        public readonly string $name,
        public readonly ?string $owner_name,
        public readonly ?string $phone,
        public readonly string $address,
        public readonly float $latitude,
        public readonly float $longitude,
        public readonly ?int $created_by_sales_id,
        public readonly ?string $image,
    ) {}

    public static function fromRequest(StoreRequest $request): self
    {
        return new self(
            name: $request->name,
            owner_name: $request->owner_name,
            phone: $request->phone,
            address: $request->address,
            latitude: (float) $request->latitude,
            longitude: (float) $request->longitude,
            created_by_sales_id: $request->created_by_sales_id,
            image: $request->image,
        );
    }
}
