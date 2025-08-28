<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Handle login request
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|min:6',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $credentials = $request->only('email', 'password');

        // Debug: Log login attempt
        \Log::info('Login attempt', [
            'email' => $request->email,
            'ip' => $request->ip(),
            'session_id' => $request->session()->getId()
        ]);

        if (Auth::attempt($credentials, $request->filled('remember'))) {
            $request->session()->regenerate();
            
            // Debug: Log successful authentication
            \Log::info('User authenticated successfully', [
                'user_id' => Auth::id(),
                'email' => $request->email,
                'redirect_to' => '/dashboard',
                'new_session_id' => $request->session()->getId()
            ]);
            
            // Try explicit redirect instead of intended
            return redirect('/dashboard');
        }

        // Debug: Log failed authentication
        \Log::warning('Authentication failed', [
            'email' => $request->email,
            'ip' => $request->ip(),
            'session_id' => $request->session()->getId()
        ]);

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->withInput();
    }

    /**
     * Handle register request
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'subscription_tier' => 'required|in:free,pro,enterprise',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Set quota limit based on subscription tier
        $quotaLimit = match($request->subscription_tier) {
            'free' => 50,
            'pro' => 100,
            'enterprise' => 200,
            default => 50,
        };

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'subscription_tier' => $request->subscription_tier,
            'quota_limit' => $quotaLimit,
        ]);

        Auth::login($user);

        return redirect('/dashboard');
    }

    /**
     * Handle logout request
     */
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return redirect('/login');
    }
}
