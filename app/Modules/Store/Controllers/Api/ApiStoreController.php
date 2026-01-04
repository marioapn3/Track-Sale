<?php

namespace App\Modules\Store\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Base\DTOs\PaginationDTO;
use App\Modules\Base\Requests\PaginationRequest;
use App\Modules\Store\DTOs\StoreDTO;
use App\Modules\Store\Requests\StoreRequest;
use App\Modules\Store\Services\Api\ApiStoreService;

class ApiStoreController extends Controller
{
    public function __construct(
        protected ApiStoreService $apiStoreService,
    ) {}

    public function getStoresPagination(PaginationRequest $request)
    {
        try {
            $dto = PaginationDTO::fromRequest($request);
            $stores = $this->apiStoreService->getStoresPagination($dto);

            return $this->responseJson($stores);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    public function createStore(StoreRequest $request)
    {
        try {
            $dto = StoreDTO::fromRequest($request);
            $store = $this->apiStoreService->createStore($dto);

            return $this->success($store, 'Store created successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    public function updateStore(int $id, StoreRequest $request)
    {
        try {
            $dto = StoreDTO::fromRequest($request);
            $store = $this->apiStoreService->updateStore($id, $dto);

            return $this->success($store, 'Store updated successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    public function deleteStore(int $id)
    {
        try {
            $this->apiStoreService->deleteStore($id);

            return $this->success(null, 'Store deleted successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    public function getAllStores()
    {
        try {
            $stores = $this->apiStoreService->getAllStores();

            return $this->success($stores, 'Stores fetched successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    public function getStoreById(int $id)
    {
        try {
            $store = $this->apiStoreService->getStoreById($id);

            return $this->success($store, 'Store fetched successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }
}
