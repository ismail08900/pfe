$ai = app(App\Services\AIService::class);
$currentPlanning = json_decode('{"lundi":{"meals":[null,null,null,null],"nutrients":{}},"mardi":{"meals":[null,null,null,null],"nutrients":{}},"mercredi":{"meals":[null,null,null,null],"nutrients":{}},"jeudi":{"meals":[null,null,null,null],"nutrients":{}},"vendredi":{"meals":[null,null,null,null],"nutrients":{}},"samedi":{"meals":[null,null,null,null],"nutrients":{}},"dimanche":{"meals":[null,null,null,null],"nutrients":{}}}', true);
$siteRecipes = [['id'=>1,'title'=>'Test','image'=>'test.jpg','readyInMinutes'=>30,'calories'=>500]];
$profile = ['goal'=>'Manger quilibr','diet'=>'Standard','allergies'=>'Aucune','activityLevel'=>'Sdentaire'];
$res = $ai->generateMealPlan($profile, $currentPlanning, $siteRecipes);
echo json_encode($res);

