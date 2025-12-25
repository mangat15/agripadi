<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::updateOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Admin',
                'email' => 'admin@gmail.com',
                'password' => Hash::make('123456789'),
                'role' => 1,
                'email_verified_at' => now(),
            ]
        );

        // Create a test farmer user
        User::updateOrCreate(
            ['email' => 'farmer@gmail.com'],
            [
                'name' => 'Demo Farmer',
                'email' => 'farmer@gmail.com',
                'password' => Hash::make('123456789'),
                'role' => 0,
                'email_verified_at' => now(),
            ]
        );
    }
}