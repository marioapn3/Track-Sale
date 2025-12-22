<?php

namespace App\Modules\Sales\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Base\DTOs\PaginationDTO;
use App\Modules\Base\Requests\PaginationRequest;
use App\Modules\Sales\DTOs\SalesDTO;
use App\Modules\Sales\Requests\SalesRequest;
use App\Modules\Sales\Services\Api\ApiSalesService;

class ApiSalesController extends Controller
{
    protected ApiSalesService $apiSalesService;

    public function __construct(
        ApiSalesService $apiSalesService
    ) {
        $this->apiSalesService = $apiSalesService;
    }

    public function getSalesPagination(PaginationRequest $request)
    {
        try {
            $dto = PaginationDTO::fromRequest($request);
            $sales = $this->apiSalesService->getSalesPagination($dto);

            return $this->responseJson($sales);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    public function createSales(SalesRequest $request)
    {
        try {
            $dto = SalesDTO::fromRequest($request);
            $sales = $this->apiSalesService->createSales($dto);

            return $this->success($sales, 'Sales created successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    public function updateSales($id, SalesRequest $request)
    {
        try {
            $dto = SalesDTO::fromRequest($request);
            $sales = $this->apiSalesService->updateSales($id, $dto);

            return $this->success($sales, 'Sales updated successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    public function deleteSales($id)
    {
        try {
            $this->apiSalesService->deleteSales($id);

            return $this->success(null, 'Sales deleted successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    public function getAllSales()
    {
        try {
            $sales = $this->apiSalesService->getAllSales();

            return $this->success($sales, 'Sales fetched successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    public function getSalesById($id)
    {
        try {
            $sales = $this->apiSalesService->getSalesById($id);

            return $this->success($sales, 'Sales fetched successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }
}
