<?php

use App\Http\Controllers\Auth\LoginController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisterController;
use App\Models\ActivityLevel;
use App\Models\Allergy;
use App\Models\DietType;
use App\Models\Goal;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\PreferenceController;

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
    return $request->user()->load('dietType', 'allergies');
});

Route::get("/tables-info", function () {
    $allergies = ActivityLevel::all();

    foreach ($allergies as $allergy) {
        echo $allergy->name . '<br>';
    }
});
Route::post("/test", function () {
    return "hello post";
});
Route::put("/test", function () {
    return "hello put";
});
Route::delete("/test", function () {
    return "hello delete";
});





Route::post('/register', [RegisterController::class, 'register']);

Route::post('/login', [LoginController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', function (Request $request) {
        return $request->user()->load('dietType', 'allergies');
    });
    Route::post('/logout', [LoginController::class, 'logout']);
    // ... autres routes protégées
});

Route::middleware('auth:sanctum')->get('/me/allergies', [UserController::class, 'myAllergies']);

Route::middleware('auth:sanctum')->get('/user-recipes', [RecipeController::class, 'getUserRecipes']);

Route::middleware('auth:sanctum')->group(function () {
    Route::put('/user/profile', [UserController::class, 'updateProfile']);
    Route::put('/user/preferences', [UserController::class, 'updatePreferences']);
});



Route::middleware('auth:sanctum')->group(function () {
    Route::get('/diets', [PreferenceController::class, 'diets']);
    Route::get('/allergies', [PreferenceController::class, 'allergies']);
});

// Pour que le front puisse charger les options :
Route::get('/allergies', fn() => Allergy::all());
Route::get('/diets-type', fn() => DietType::all());
Route::get('/goals', fn() => Goal::all());
Route::get('/activities-level', fn() => ActivityLevel::all());
Route::middleware('auth:sanctum')->get('/user-recipes', [RecipeController::class, 'getUserRecipes']);
