<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class RecipeController extends Controller
{
    public function getUserRecipes(Request $request)
    {
        $user = $request->user();

        $diet = $user->dietType?->name ?? null;
        $allergies = $user->allergies()->pluck('name')->toArray();
        $intolerances = $allergies ? implode(',', $allergies) : null;

        $includeIngredients = $request->input('includeIngredients');
        $excludeIngredients = $request->input('excludeIngredients');
        $cuisine = $request->input('cuisine');
        $type = $request->input('type');
        $maxReadyTime = $request->input('maxReadyTime', $request->input('maxTime'));
        $maxCalories = $request->input('maxCalories');
        $minCalories = $request->input('minCalories');
        $maxProtein = $request->input('maxProtein');
        $minProtein = $request->input('minProtein');
        $maxCarbs   = $request->input('maxCarbs');
        $minCarbs   = $request->input('minCarbs');
        $maxFat     = $request->input('maxFat');
        $minFat     = $request->input('minFat');
        $minServings = $request->input('minServings');

        $params = [
            'apiKey' => env('SPOONACULAR_API_KEY'),
            'number' => 4,
            'addRecipeNutrition' => 'true',
            'excludeIngredients' => 'pork,bacon,ham,alcohol,wine,beer,rum,gelatin,lard,prosciutto,chorizo,pepperoni,sausage',
        ];
        if ($diet) $params['diet'] = $diet;
        if ($intolerances) $params['intolerances'] = $intolerances;
        if (!empty($includeIngredients)) $params['includeIngredients'] = $includeIngredients;
        if (!empty($excludeIngredients)) $params['excludeIngredients'] .= ',' . $excludeIngredients;
        if (!empty($cuisine)) $params['cuisine'] = $cuisine;
        if (!empty($type)) $params['type'] = $type;
        if (!empty($maxReadyTime)) $params['maxReadyTime'] = $maxReadyTime;
        if (!empty($minCalories)) $params['minCalories'] = $minCalories;
        if (!empty($maxCalories)) $params['maxCalories'] = $maxCalories;
        if (!empty($minProtein))  $params['minProtein'] = $minProtein;
        if (!empty($maxProtein))  $params['maxProtein'] = $maxProtein;
        if (!empty($minCarbs))    $params['minCarbs'] = $minCarbs;
        if (!empty($maxCarbs))    $params['maxCarbs'] = $maxCarbs;
        if (!empty($minFat))      $params['minFat'] = $minFat;
        if (!empty($maxFat))      $params['maxFat'] = $maxFat;
        if (!empty($minServings)) $params['minServings'] = $minServings;

        $response = Http::get('https://api.spoonacular.com/recipes/complexSearch', $params);

        if (!$response->successful()) {
            return response()->json(['error' => 'Erreur avec Spoonacular'], 500);
        }

        $recipes = $response->json()['results'] ?? [];
        $detailedRecipes = [];

        foreach ($recipes as $recipe) {
            $detailedRecipes[] = [
                'id' => $recipe['id'] ?? null,
                'title' => $recipe['title'] ?? '',
                'image' => $recipe['image'] ?? '',
                'readyInMinutes' => $recipe['readyInMinutes'] ?? 30,
                'servings' => $recipe['servings'] ?? 1,
                'sourceUrl' => $recipe['sourceUrl'] ?? '',
                'calories' => isset($recipe['nutrition']['nutrients']) ? self::getNutrient($recipe['nutrition']['nutrients'], 'Calories') : '—',
                'protein' => isset($recipe['nutrition']['nutrients']) ? self::getNutrient($recipe['nutrition']['nutrients'], 'Protein') : '—',
                'fat' => isset($recipe['nutrition']['nutrients']) ? self::getNutrient($recipe['nutrition']['nutrients'], 'Fat') : '—',
                'carbs' => isset($recipe['nutrition']['nutrients']) ? self::getNutrient($recipe['nutrition']['nutrients'], 'Carbohydrates') : '—',
                'summary' => isset($recipe['summary']) ? strip_tags($recipe['summary']) : '',
                'diets' => $recipe['diets'] ?? [],
                'tags' => $recipe['tags'] ?? [],
            ];
        }

        return response()->json([
            'results' => $detailedRecipes
        ]);
    }

    private static function getNutrient($nutrients, $name)
    {
        foreach ($nutrients as $nutrient) {
            if (strcasecmp($nutrient['name'], $name) === 0) {
                return round($nutrient['amount']);
            }
        }
        return '—';
    }

    public function getRecipeDetails($id)
    {
        $params = [
            'apiKey' => env('SPOONACULAR_API_KEY'),
            'includeNutrition' => 'true',
        ];
        $response = Http::get("https://api.spoonacular.com/recipes/{$id}/information", $params);

        if (!$response->successful()) {
            return response()->json(['error' => 'Erreur lors de la récupération des détails'], 500);
        }

        return response()->json($response->json());
    }
}
