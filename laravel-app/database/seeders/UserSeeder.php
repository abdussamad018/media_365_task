<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create demo users with different subscription tiers
        $users = [
            [
                'name' => 'Free User',
                'email' => 'free@example.com',
                'password' => Hash::make('password'),
                'subscription_tier' => 'free',
                'quota_limit' => 50,
            ],
            [
                'name' => 'Pro User',
                'email' => 'pro@example.com',
                'password' => Hash::make('password'),
                'subscription_tier' => 'pro',
                'quota_limit' => 100,
            ],
            [
                'name' => 'Enterprise User',
                'email' => 'enterprise@example.com',
                'password' => Hash::make('password'),
                'subscription_tier' => 'enterprise',
                'quota_limit' => 200,
            ],
        ];

        foreach ($users as $userData) {
            User::updateOrCreate(
                ['email' => $userData['email']],
                $userData
            );
        }

        $this->command->info('Demo users created successfully!');
        $this->command->info('Free User: free@example.com (password: password)');
        $this->command->info('Pro User: pro@example.com (password: password)');
        $this->command->info('Enterprise User: enterprise@example.com (password: password)');
    }
}
