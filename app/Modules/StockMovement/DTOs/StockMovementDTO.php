<?php

namespace App\Modules\StockMovement\DTOs;

use App\Modules\StockMovement\Requests\StockMovementRequest;

class StockMovementDTO
{
    private function __construct(
        public readonly int $product_id,
        public readonly string $type,
        public readonly int $quantity,
        public readonly ?string $source,
        public readonly ?string $reference,
        public readonly ?int $user_id,
    ) {}

    public static function fromRequest(
        StockMovementRequest $request
    ): self {
        return new self(
            product_id: $request->product_id,
            type: $request->type,
            quantity: $request->quantity,
            source: $request->source,
            reference: $request->reference,
            user_id: $request->user_id,
        );
    }
}





