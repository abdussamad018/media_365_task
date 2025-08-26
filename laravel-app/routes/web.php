<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ThumbnailController;

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

Route::get('/', [ThumbnailController::class, 'index'])->name('thumbnails.index');
Route::post('/thumbnails', [ThumbnailController::class, 'store'])->name('thumbnails.store');
Route::get('/thumbnails/{bulkRequest}/status', [ThumbnailController::class, 'status'])->name('thumbnails.status');
Route::get('/thumbnails/results', [ThumbnailController::class, 'results'])->name('thumbnails.results');
