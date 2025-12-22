<?php

namespace App\Modules\StockMovement\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Base\DTOs\PaginationDTO;
use App\Modules\Base\Requests\PaginationRequest;
use App\Modules\StockMovement\DTOs\StockMovementDTO;
use App\Modules\StockMovement\Requests\StockMovementRequest;
use App\Modules\StockMovement\Services\Api\ApiStockMovementService;

class ApiStockMovementController extends Controller
{
    protected ApiStockMovementService $apiStockMovementService;

    public function __construct(
        ApiStockMovementService $apiStockMovementService
    ) {
        $this->apiStockMovementService = $apiStockMovementService;
    }

    public function getStockMovementsPagination(PaginationRequest $request)
    {
        try {
            $dto = PaginationDTO::fromRequest($request);
            $stockMovements = $this->apiStockMovementService->getStockMovementsPagination($dto);

            return $this->responseJson($stockMovements);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    public function createStockMovement(StockMovementRequest $request)
    {
        try {
            $dto = StockMovementDTO::fromRequest($request);
            $stockMovement = $this->apiStockMovementService->createStockMovement($dto);

            return $this->success($stockMovement, 'Stock movement created successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    public function updateStockMovement($id, StockMovementRequest $request)
    {
        try {
            $dto = StockMovementDTO::fromRequest($request);
            $stockMovement = $this->apiStockMovementService->updateStockMovement($id, $dto);

            return $this->success($stockMovement, 'Stock movement updated successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    public function deleteStockMovement($id)
    {
        try {
            $this->apiStockMovementService->deleteStockMovement($id);

            return $this->success(null, 'Stock movement deleted successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    public function getAllStockMovements()
    {
        try {
            $stockMovements = $this->apiStockMovementService->getAllStockMovements();

            return $this->success($stockMovements, 'Stock movements fetched successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    public function getStockMovementById($id)
    {
        try {
            $stockMovement = $this->apiStockMovementService->getStockMovementById($id);

            return $this->success($stockMovement, 'Stock movement fetched successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    public function getStockMovementsByProductSlug($productSlug, PaginationRequest $request)
    {
        try {
            $dto = PaginationDTO::fromRequest($request);
            $result = $this->apiStockMovementService->getStockMovementsByProductSlug($productSlug, $dto);

            return $this->success($result, 'Stock movements fetched successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), $e->getCode() ?? 500);
        }
    }
}
