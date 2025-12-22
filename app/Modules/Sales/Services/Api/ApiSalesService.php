<?php

namespace App\Modules\Sales\Services\Api;

use App\Helpers\PaginationHelper;
use App\Modules\Base\DTOs\PaginationDTO;
use App\Modules\Sales\DTOs\SalesDTO;
use App\Modules\User\Models\User;
use Illuminate\Support\Facades\Hash;

class ApiSalesService
{
    public function getSalesPagination(
        PaginationDTO $dto
    ) {
        $sales = User::role('sales')
            ->when($dto->search, function ($query) use ($dto) {
                $query->where(function ($q) use ($dto) {
                    $q->where('name', 'like', '%'.$dto->search.'%')
                        ->orWhere('email', 'like', '%'.$dto->search.'%');
                });
            })
            ->when($dto->sort, function ($query) use ($dto) {
                $query->orderBy($dto->sort_by, $dto->sort_direction);
            }, function ($query) {
                $query->latest();
            })
            ->paginate($dto->per_page, ['*'], 'page', $dto->page);

        return PaginationHelper::format($sales);
    }

    public function createSales(SalesDTO $dto)
    {
        $user = User::create([
            'name' => $dto->name,
            'email' => $dto->email,
            'password' => Hash::make($dto->password),
        ]);

        $user->assignRole('sales');

        return $user;
    }

    public function updateSales($id, SalesDTO $dto)
    {
        $user = User::role('sales')->find($id);
        if (! $user) {
            throw new \Exception('Sales not found', 404);
        }

        $updateData = [
            'name' => $dto->name,
            'email' => $dto->email,
        ];

        if ($dto->password) {
            $updateData['password'] = Hash::make($dto->password);
        }

        $user->update($updateData);

        return $user;
    }

    public function deleteSales($id)
    {
        $user = User::role('sales')->find($id);
        if (! $user) {
            throw new \Exception('Sales not found', 404);
        }

        $user->delete();

        return $user;
    }

    public function getAllSales()
    {
        return User::role('sales')->get();
    }

    public function getSalesById($id)
    {
        $user = User::role('sales')->find($id);
        if (! $user) {
            throw new \Exception('Sales not found', 404);
        }

        return $user;
    }
}
