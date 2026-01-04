<?php

namespace App\Modules\Store\Services\Api;

use App\Helpers\PaginationHelper;
use App\Modules\Base\DTOs\PaginationDTO;
use App\Modules\Store\DTOs\StoreDTO;
use App\Modules\Store\Models\Store;
use Illuminate\Support\Facades\DB;

class ApiStoreService
{
    public function getStoresPagination(PaginationDTO $dto)
    {
        $stores = Store::query()
            ->with('createdBySales')
            ->when($dto->search, function ($query) use ($dto) {
                $query->where(function ($q) use ($dto) {
                    $q->where('name', 'like', '%'.$dto->search.'%')
                        ->orWhere('owner_name', 'like', '%'.$dto->search.'%')
                        ->orWhere('address', 'like', '%'.$dto->search.'%');
                });
            })
            ->when($dto->sort, function ($query) use ($dto) {
                $query->orderBy($dto->sort_by, $dto->sort_direction);
            }, function ($query) {
                $query->latest();
            })
            ->paginate($dto->per_page, ['*'], 'page', $dto->page);

        return PaginationHelper::format($stores);
    }

    public function createStore(StoreDTO $dto)
    {
        return DB::transaction(function () use ($dto) {
            $createdBy = $dto->created_by_sales_id ?? auth()->id();

            $store = Store::create([
                'name' => $dto->name,
                'owner_name' => $dto->owner_name,
                'phone' => $dto->phone,
                'address' => $dto->address,
                'latitude' => $dto->latitude,
                'longitude' => $dto->longitude,
                'created_by_sales_id' => $createdBy,
                'image' => $dto->image,
            ]);

            return $store->load('createdBySales');
        });
    }

    public function updateStore(int $id, StoreDTO $dto)
    {
        return DB::transaction(function () use ($id, $dto) {
            $store = Store::find($id);

            if (! $store) {
                throw new \Exception('Store not found', 404);
            }

            $store->update([
                'name' => $dto->name,
                'owner_name' => $dto->owner_name,
                'phone' => $dto->phone,
                'address' => $dto->address,
                'latitude' => $dto->latitude,
                'longitude' => $dto->longitude,
                'image' => $dto->image,
            ]);

            return $store->load('createdBySales');
        });
    }

    public function deleteStore(int $id)
    {
        return DB::transaction(function () use ($id) {
            $store = Store::find($id);

            if (! $store) {
                throw new \Exception('Store not found', 404);
            }

            $store->delete();

            return $store;
        });
    }

    public function getAllStores()
    {
        return Store::with('createdBySales')->latest()->get();
    }

    public function getStoreById(int $id)
    {
        $store = Store::with('createdBySales')->find($id);

        if (! $store) {
            throw new \Exception('Store not found', 404);
        }

        return $store;
    }
}
