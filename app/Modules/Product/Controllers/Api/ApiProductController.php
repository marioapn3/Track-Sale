<?php

namespace App\Modules\Product\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Base\DTOs\PaginationDTO;
use App\Modules\Base\Requests\PaginationRequest;
use App\Modules\Product\DTOs\ProductDTO;
use App\Modules\Product\Requests\ProductRequest;
use App\Modules\Product\Services\Api\ApiProductService;

class ApiProductController extends Controller
{
    protected ApiProductService $apiProductService;

    public function __construct(
        ApiProductService $apiProductService
    ) {
        $this->apiProductService = $apiProductService;
    }

    public function getProductsPagination(PaginationRequest $request)
    {
        try {
            $dto = PaginationDTO::fromRequest($request);
            $products = $this->apiProductService->getProductsPagination($dto);

            return $this->responseJson($products);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    public function createProduct(ProductRequest $request)
    {
        try {
            $dto = ProductDTO::fromRequest($request);
            $product = $this->apiProductService->createProduct($dto);

            return $this->success($product, 'Product created successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    public function updateProduct($id, ProductRequest $request)
    {
        try {
            $dto = ProductDTO::fromRequest($request);
            $product = $this->apiProductService->updateProduct($id, $dto);

            return $this->success($product, 'Product updated successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    public function deleteProduct($id)
    {
        try {
            $this->apiProductService->deleteProduct($id);

            return $this->success(null, 'Product deleted successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    public function getAllProducts()
    {
        try {
            $products = $this->apiProductService->getAllProducts();

            return $this->success($products, 'Products fetched successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    public function getProductById($id)
    {
        try {
            $product = $this->apiProductService->getProductById($id);

            return $this->success($product, 'Product fetched successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }
}
