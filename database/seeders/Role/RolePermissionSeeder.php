<?php

namespace Database\Seeders\Role;

use App\Modules\User\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'admin',
                'permissions' => [
                    'create-role',
                    'read-role',
                    'update-role',
                    'delete-role',
                ],
            ],
            [
                'name' => 'sales',
            ]
        ];

        foreach ($roles as $roleData) {
            $permissions = $roleData['permissions'] ?? [];
            unset($roleData['permissions']);

            $role = Role::firstOrCreate($roleData);

            foreach ($permissions as $permission) {
                Permission::firstOrCreate(['name' => $permission]);
            }

            $role->syncPermissions($permissions);
        }

        $adminUser = User::where('email', 'admin@gmail.com')->first();
        if ($adminUser) {
            $adminUser->assignRole('admin');
        }

        $salesUser = User::where('email', 'sales@gmail.com')->first();
        if ($salesUser) {
            $salesUser->assignRole('sales');
        }
    }
}
