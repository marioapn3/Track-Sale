<?php

namespace Database\Seeders\User;

use App\Modules\User\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Admin',
                'email' => 'admin@gmail.com',
                'password' => bcrypt('admin123'), 
            ],
            [
                'name' => 'Sales',
                'email' => 'sales@gmail.com',
                'password' => bcrypt('sales123'),
            ]
        ];

        // Insert ke database
        foreach ($users as $user) {
            User::create($user);
        }
    }
}
