<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;

$farmer = User::create([
    'name' => 'Petani Test',
    'email' => 'petani@test.com',
    'password' => bcrypt('password'),
    'role' => 2, // Farmer role
    'email_verified_at' => now(),
]);

echo "✅ Test farmer created successfully!\n";
echo "Email: {$farmer->email}\n";
echo "Password: password\n";
echo "Email verified: Yes\n";
