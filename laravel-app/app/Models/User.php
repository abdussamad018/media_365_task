<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'subscription_tier',
        'quota_limit',
        'quota_used',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Get the bulk requests for the user.
     */
    public function bulkRequests()
    {
        return $this->hasMany(BulkRequest::class);
    }

    /**
     * Check if user has quota available.
     */
    public function hasQuotaAvailable(int $count): bool
    {
        return ($this->quota_used + $count) <= $this->quota_limit;
    }

    /**
     * Get priority multiplier based on subscription tier.
     */
    public function getPriorityMultiplier(): int
    {
        return match($this->subscription_tier) {
            'enterprise' => 3,
            'pro' => 2,
            'free' => 1,
            default => 1,
        };
    }
}
