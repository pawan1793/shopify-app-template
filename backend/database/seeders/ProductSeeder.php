<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\User;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all users
        $users = User::all();
        
        if ($users->count() === 0) {
            // Create a user if none exists
            $user = User::factory()->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => bcrypt('password'),
            ]);
            $users = collect([$user]);
        }
        
        // Create 5 products for each user
        foreach ($users as $user) {
            for ($i = 1; $i <= 5; $i++) {
                Product::create([
                    'name' => "User {$user->id}'s Product {$i}",
                    'description' => "This is product {$i} belonging to user {$user->id}",
                    'price' => rand(10, 1000) / 10,
                    'user_id' => $user->id,
                ]);
            }
        }
    }
}