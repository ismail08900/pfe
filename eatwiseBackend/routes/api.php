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
use App\Http\Middleware\EnsureEmailIsVerified;

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

Route::middleware('auth:sanctum', EnsureEmailIsVerified::class)->get('/user', function (Request $request) {
    return $request->user()->load('dietType', 'allergies');
});

Route::get("/tables-info", function () {
    $allergies = ActivityLevel::all();

    foreach ($allergies as $allergy) {
        echo $allergy->name . '<br>';
    }
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

Route::middleware('auth:sanctum', EnsureEmailIsVerified::class)->get('/user-recipes', [RecipeController::class, 'getUserRecipes']);
Route::middleware('auth:sanctum', EnsureEmailIsVerified::class)->get('/recipes/{id}', [RecipeController::class, 'getRecipeDetails']);
Route::middleware('auth:sanctum', EnsureEmailIsVerified::class)->group(function () {
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
//Route::middleware('auth:sanctum')->get('/user-recipes', [RecipeController::class, 'getUserRecipes']);



// Pour vérifier l’email (le lien de l’email redirigera ici)
use Illuminate\Support\Facades\Redirect;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\Events\Verified;
// Pour renvoyer l’email de vérification
use App\Http\Controllers\Auth\EmailVerificationController;

Route::middleware(['auth:sanctum'])->post('/email/verification-notification', [EmailVerificationController::class, 'send']);
Route::middleware(['auth:sanctum'])->get('/email/is-verified', [EmailVerificationController::class, 'isVerified']);
Route::get('/email/verify/{id}/{hash}', function ($id, $hash) {
    $user = User::findOrFail($id);


    // Vérifie que le hash du lien correspond bien à l'utilisateur
    if (! hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
        throw new AuthorizationException();
    }

    // Si l'utilisateur n'est pas déjà vérifié
    if (!$user->hasVerifiedEmail()) {
        $user->markEmailAsVerified();
        event(new Verified($user));
    }

    return Redirect::to('http://localhost:5173/email-verified');
})->middleware(['signed'])->name('verification.verify');
