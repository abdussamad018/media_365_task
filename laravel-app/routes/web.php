<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ThumbnailController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NotificationController;
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



// Protected Routes - Serve Inertia.js app
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
    

    
    // API endpoints for Inertia.js
    Route::post('/thumbnails', [ThumbnailController::class, 'store'])->name('thumbnails.store');
    Route::get('/thumbnails/{bulkRequest}/status', [ThumbnailController::class, 'status'])->name('thumbnails.status');
    Route::get('/thumbnails/results', [ThumbnailController::class, 'results'])->name('thumbnails.results');

    

    

    
    // Notification endpoints
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::get('/notifications/stats', [NotificationController::class, 'stats'])->name('notifications.stats');
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount'])->name('notifications.unreadCount');
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.markAsRead');
    Route::patch('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.markAllAsRead');
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy'])->name('notifications.destroy');
    
    // Queue status endpoint
    Route::get('/queue/status', [ThumbnailController::class, 'queueStatus'])->name('queue.status');
});
