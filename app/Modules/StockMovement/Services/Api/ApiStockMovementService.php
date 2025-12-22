<?php

namespace App\Modules\StockMovement\Services\Api;

use App\Helpers\PaginationHelper;
use App\Modules\Base\DTOs\PaginationDTO;
use App\Modules\Product\Models\Product;
use App\Modules\StockMovement\DTOs\StockMovementDTO;
use App\Modules\StockMovement\Models\StockMovement;
use Illuminate\Support\Facades\DB;

class ApiStockMovementService
{
    public function getStockMovementsPagination(
        PaginationDTO $dto
    ) {
        $stockMovements = StockMovement::with(['product', 'user'])
            ->when($dto->search, function ($query) use ($dto) {
                $query->where(function ($q) use ($dto) {
                    $q->whereHas('product', function ($productQuery) use ($dto) {
                        $productQuery->where('name', 'like', '%'.$dto->search.'%')
                            ->orWhere('sku', 'like', '%'.$dto->search.'%');
                    })
                        ->orWhere('type', 'like', '%'.$dto->search.'%')
                        ->orWhere('source', 'like', '%'.$dto->search.'%')
                        ->orWhere('reference', 'like', '%'.$dto->search.'%');
                });
            })
            ->when($dto->sort, function ($query) use ($dto) {
                $query->orderBy($dto->sort_by, $dto->sort_direction);
            }, function ($query) {
                $query->latest();
            })
            ->paginate($dto->per_page, ['*'], 'page', $dto->page);

        return PaginationHelper::format($stockMovements);
    }

    public function createStockMovement(StockMovementDTO $dto)
    {
        return DB::transaction(function () use ($dto) {
            $product = Product::find($dto->product_id);
            if (! $product) {
                throw new \Exception('Product not found', 404);
            }

            $stockMovement = StockMovement::create([
                'product_id' => $dto->product_id,
                'type' => $dto->type,
                'quantity' => $dto->quantity,
                'source' => $dto->source,
                'reference' => $dto->reference,
                // 'user_id' => $dto->user_id ?? auth()->id(),
                'user_id' => 1,
            ]);

            // Update product stock based on type
            $this->updateProductStock($product, $dto->type, $dto->quantity);

            return $stockMovement->load(['product', 'user']);
        });
    }

    public function updateStockMovement($id, StockMovementDTO $dto)
    {
        return DB::transaction(function () use ($id, $dto) {
            $stockMovement = StockMovement::find($id);
            if (! $stockMovement) {
                throw new \Exception('Stock movement not found', 404);
            }

            $product = Product::find($dto->product_id);
            if (! $product) {
                throw new \Exception('Product not found', 404);
            }

            // Reverse the previous stock change
            $this->reverseProductStock($product, $stockMovement->type, $stockMovement->quantity);

            // Update stock movement
            $stockMovement->update([
                'product_id' => $dto->product_id,
                'type' => $dto->type,
                'quantity' => $dto->quantity,
                'source' => $dto->source,
                'reference' => $dto->reference,
                // 'user_id' => $dto->user_id ?? $stockMovement->user_id,
                'user_id' => 1,
            ]);

            // Apply new stock change
            $this->updateProductStock($product, $dto->type, $dto->quantity);

            return $stockMovement->load(['product', 'user']);
        });
    }

    public function deleteStockMovement($id)
    {
        return DB::transaction(function () use ($id) {
            $stockMovement = StockMovement::find($id);
            if (! $stockMovement) {
                throw new \Exception('Stock movement not found', 404);
            }

            $product = $stockMovement->product;

            // Reverse the stock change
            $this->reverseProductStock($product, $stockMovement->type, $stockMovement->quantity);

            $stockMovement->delete();

            return $stockMovement;
        });
    }

    public function getAllStockMovements()
    {
        return StockMovement::with(['product', 'user'])->latest()->get();
    }

    public function getStockMovementById($id)
    {
        $stockMovement = StockMovement::with(['product', 'user'])->find($id);
        if (! $stockMovement) {
            throw new \Exception('Stock movement not found', 404);
        }

        return $stockMovement;
    }

    public function getStockMovementsByProductSlug(string $slug, PaginationDTO $dto)
    {
        $product = Product::where('slug', $slug)->first();
        if (! $product) {
            throw new \Exception('Product not found', 404);
        }

        $stockMovements = StockMovement::with(['product', 'user'])
            ->where('product_id', $product->id)
            ->when($dto->search, function ($query) use ($dto) {
                $query->where(function ($q) use ($dto) {
                    $q->where('type', 'like', '%'.$dto->search.'%')
                        ->orWhere('source', 'like', '%'.$dto->search.'%')
                        ->orWhere('reference', 'like', '%'.$dto->search.'%');
                });
            })
            ->when($dto->sort, function ($query) use ($dto) {
                $query->orderBy($dto->sort_by, $dto->sort_direction);
            }, function ($query) {
                $query->latest();
            })
            ->paginate($dto->per_page, ['*'], 'page', $dto->page);

        return [
            'product' => $product,
            'stock_movements' => PaginationHelper::format($stockMovements),
        ];
    }

    /**
     * Update product stock based on movement type
     */
    protected function updateProductStock(Product $product, string $type, int $quantity): void
    {
        switch ($type) {
            case 'IN':
                $product->increment('stock', $quantity);
                break;
            case 'OUT':
                $product->decrement('stock', $quantity);
                // Ensure stock doesn't go negative
                if ($product->fresh()->stock < 0) {
                    throw new \Exception('Insufficient stock. Current stock: '.$product->fresh()->stock);
                }
                break;
            case 'ADJUST':
                $product->update(['stock' => $quantity]);
                break;
        }
    }

    /**
     * Reverse product stock change
     */
    protected function reverseProductStock(Product $product, string $type, int $quantity): void
    {
        switch ($type) {
            case 'IN':
                $product->decrement('stock', $quantity);
                break;
            case 'OUT':
                $product->increment('stock', $quantity);
                break;
            case 'ADJUST':
                // For ADJUST, recalculate stock from all remaining movements
                $this->recalculateProductStock($product);
                break;
        }
    }

    /**
     * Recalculate product stock from all stock movements
     */
    protected function recalculateProductStock(Product $product): void
    {
        $stockMovements = StockMovement::where('product_id', $product->id)->get();
        $calculatedStock = 0;

        foreach ($stockMovements as $movement) {
            switch ($movement->type) {
                case 'IN':
                    $calculatedStock += $movement->quantity;
                    break;
                case 'OUT':
                    $calculatedStock -= $movement->quantity;
                    break;
                case 'ADJUST':
                    $calculatedStock = $movement->quantity;
                    break;
            }
        }

        // Ensure stock doesn't go negative
        $finalStock = max(0, $calculatedStock);
        $product->update(['stock' => $finalStock]);
    }
}
