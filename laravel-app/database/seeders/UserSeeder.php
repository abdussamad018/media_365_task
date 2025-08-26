<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create sample users with different subscription tiers
        User::create([
            'name' => 'Free User',
            'email' => 'free@example.com',
            'subscription_tier' => 'free',
            'quota_limit' => 50,
            'quota_used' => 0,
        ]);

        User::create([
            'name' => 'Pro User',
            'email' => 'pro@example.com',
            'subscription_tier' => 'pro',
            'quota_limit' => 100,
            'quota_used' => 0,
        ]);

        User::create([
            'name' => 'Enterprise User',
            'email' => 'enterprise@example.com',
            'subscription_tier' => 'enterprise',
            'quota_limit' => 200,
            'quota_used' => 0,
        ]);
    }
}
