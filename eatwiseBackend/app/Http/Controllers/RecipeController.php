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

        $params = [
            'apiKey' => env('SPOONACULAR_API_KEY'),
            'number' => 2, // ou le nombre désiré
            'addRecipeNutrition' => 'true',
            'excludeIngredients' => 'pork,bacon,ham,alcohol,wine,beer,rum,gelatin,lard,prosciutto,chorizo,pepperoni,sausage',

        ];
        if ($diet) $params['diet'] = $diet;
        if ($intolerances) $params['intolerances'] = $intolerances;

        $response = Http::get('https://api.spoonacular.com/recipes/complexSearch', $params);

        if (!$response->successful()) {
            return response()->json(['error' => 'Erreur avec Spoonacular'], 500);
        }

        $recipes = $response->json()['results'] ?? [];
        $detailedRecipes = [];

        foreach ($recipes as $recipe) {
            $nutrients = $recipe['nutrition']['nutrients'] ?? [];

            $getNutrient = function ($name) use ($nutrients) {
                foreach ($nutrients as $nutrient) {
                    if (strcasecmp($nutrient['name'], $name) === 0) {
                        return round($nutrient['amount']);
                    }
                }
                return null;
            };

            $detailedRecipes[] = [
                'id' => $recipe['id'] ?? null,
                'title' => $recipe['title'] ?? '',
                'image' => $recipe['image'] ?? '',
                'readyInMinutes' => $recipe['readyInMinutes'] ?? 30,
                'servings' => $recipe['servings'] ?? 1,
                'sourceUrl' => $recipe['sourceUrl'] ?? '',
                'calories' => $getNutrient('Calories') ?? '—',
                'protein' => $getNutrient('Protein') ?? '—',
                'fat' => $getNutrient('Fat') ?? '—',
                'carbs' => $getNutrient('Carbohydrates') ?? '—',
                'summary' => isset($recipe['summary']) ? strip_tags($recipe['summary']) : '',
                'diets' => $recipe['diets'] ?? [],
                'tags' => $recipe['tags'] ?? [],
            ];
        }

        return response()->json([
            'results' => $detailedRecipes
        ]);
    }
}
