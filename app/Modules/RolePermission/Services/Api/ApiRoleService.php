<?php

namespace App\Modules\RolePermission\Services\Api;

use App\Helpers\PaginationHelper;
use App\Modules\Base\DTOs\PaginationDTO;
use App\Modules\RolePermission\DTOs\RoleDTO;
use Spatie\Permission\Models\Role;

class ApiRoleService
{
    public function getRolesPagination(
        PaginationDTO $dto
    ) {
        $roles = Role::with('permissions')
            ->when($dto->search, function ($query) use ($dto) {
                $query->where('name', 'like', '%' . $dto->search . '%');
            })
            ->when($dto->sort, function ($query) use ($dto) {
                $query->orderBy($dto->sort_by, $dto->sort_direction);
            })
            ->paginate($dto->per_page, ['*'], 'page', $dto->page);

        return PaginationHelper::format($roles);
    }

    public function createRole(RoleDTO $dto)
    {
        $role = Role::create([
            'name' => $dto->name,
        ]);
        return $role;
    }

    public function updateRole($id, RoleDTO $dto)
    {
        $role = Role::find($id);
        if (!$role) {
            throw new \Exception('Role not found');
        }
        $role->update([
            'name' => $dto->name,
        ]);
        return $role;
    }

    public function deleteRole($id)
    {
        $role = Role::find($id);
        if (!$role) {
            throw new \Exception('Role not found');
        }
        $role->delete();
        return $role;
    }

    public function getAllRoles(){
        return Role::all();
    }
}
