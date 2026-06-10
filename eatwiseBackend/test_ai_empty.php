$ai = app(App\Services\AIService::class);
$currentPlanning = json_decode('{"lundi":{"meals":[null,null,null,null],"nutrients":{}},"mardi":{"meals":[null,null,null,null],"nutrients":{}}}', true);
$siteRecipes = [];
$profile = ['goal'=>'Manger quilibr','diet'=>'Standard','allergies'=>'Aucune','activityLevel'=>'Sdentaire'];
$res = $ai->generateMealPlan($profile, $currentPlanning, $siteRecipes);
echo json_encode($res);
