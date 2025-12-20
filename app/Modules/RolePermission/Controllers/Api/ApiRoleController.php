<?php

namespace App\Modules\RolePermission\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Base\DTOs\PaginationDTO;
use App\Modules\Base\Requests\PaginationRequest;
use App\Modules\RolePermission\DTOs\RoleDTO;
use App\Modules\RolePermission\Requests\RoleRequest;
use Illuminate\Http\JsonResponse;
use App\Modules\RolePermission\Services\Api\ApiRoleService;

class ApiRoleController extends Controller
{
    protected ApiRoleService $apiRoleService;

    public function __construct(
        ApiRoleService $apiRoleService
    ) {
        $this->apiRoleService = $apiRoleService;
    }

    public function getRolesPagination(PaginationRequest $request)
    {
        try {
            $dto = PaginationDTO::fromRequest($request);
            $roles = $this->apiRoleService->getRolesPagination($dto);
            return $this->responseJson($roles);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    public function createRole(RoleRequest $request)
    {
        try {
            $dto = RoleDTO::fromRequest($request);
            $role = $this->apiRoleService->createRole($dto);
            return $this->success($role, 'Role created successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    public function updateRole($id, RoleRequest $request)
    {
        try {
            $dto = RoleDTO::fromRequest($request);
            $role = $this->apiRoleService->updateRole($id, $dto);
            return $this->success($role, 'Role updated successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    public function deleteRole($id)
    {
        try {
            $this->apiRoleService->deleteRole($id);
            return $this->success(null, 'Role deleted successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    public function getAllRoles()
    {
        try {
            $roles = $this->apiRoleService->getAllRoles();
            return $this->success($roles, 'Roles fetched successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }
}
