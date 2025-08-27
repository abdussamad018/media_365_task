<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ThumbnailController;
use App\Http\Controllers\AuthController;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Authentication Routes (only for guests)
Route::middleware(['guest'])->group(function () {
    Route::get('/login', function () {
        return Inertia::render('Auth/Login');
    })->name('auth.login');

    Route::post('/login', [AuthController::class, 'login']);
    
    Route::get('/register', function () {
        return Inertia::render('Auth/Register');
    })->name('auth.register');
    
    Route::post('/register', [AuthController::class, 'register']);
});

Route::post('/logout', [AuthController::class, 'logout'])->name('auth.logout')->middleware('auth');

// Redirect root to login if not authenticated, or to dashboard if authenticated
Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('auth.login');
});

// Test route to check authentication state
Route::get('/auth-status', function () {
    return response()->json([
        'authenticated' => auth()->check(),
        'user' => auth()->user(),
        'session_id' => session()->getId(),
        'intended_url' => session()->get('url.intended'),
    ]);
});

// Protected Routes - Serve Inertia.js app
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        // Debug: Log dashboard access
        \Log::info('Dashboard accessed', [
            'user_id' => auth()->id(),
            'user_email' => auth()->user()->email ?? 'unknown',
            'session_id' => session()->getId(),
        ]);
        
        return Inertia::render('Dashboard');
    })->name('dashboard');
    
    // Debug route to test authentication
    Route::get('/debug-auth', function () {
        return response()->json([
            'authenticated' => auth()->check(),
            'user' => auth()->user(),
            'session_id' => session()->getId(),
        ]);
    });
    
    // Simple test route without Inertia
    Route::get('/test-dashboard', function () {
        return response()->json([
            'message' => 'Dashboard test route accessed successfully',
            'user' => auth()->user(),
            'timestamp' => now()
        ]);
    });
    
    // API endpoints for Inertia.js
    Route::post('/thumbnails', [ThumbnailController::class, 'store'])->name('thumbnails.store');
    Route::get('/thumbnails/{bulkRequest}/status', [ThumbnailController::class, 'status'])->name('thumbnails.status');
    Route::get('/thumbnails/results', [ThumbnailController::class, 'results'])->name('thumbnails.results');
});
