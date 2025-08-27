<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ThumbnailController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/thumbnails', [ThumbnailController::class, 'results']);
    Route::post('/thumbnails', [ThumbnailController::class, 'store']);
    Route::get('/thumbnails/{bulkRequest}/status', [ThumbnailController::class, 'status']);
});
