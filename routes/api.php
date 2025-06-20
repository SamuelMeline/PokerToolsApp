<?php 

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LexiqueController;

Route::prefix('lexique')->group(function () {
    Route::get('/', [LexiqueController::class, 'index']);
    Route::post('/', [LexiqueController::class, 'store']);
    Route::put('/{id}', [LexiqueController::class, 'update']);
    Route::delete('/{id}', [LexiqueController::class, 'destroy']);
});



