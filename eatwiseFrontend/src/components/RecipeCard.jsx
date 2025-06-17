import { Link } from "react-router-dom";
import { Clock, Flame } from "lucide-react";

// Utilitaire pour formater proprement une recette (à exporter si partagé)
export function formatRecipe(recipe) {
  let protein = recipe.protein ?? "-";
  let carbs = recipe.carbs ?? "-";
  let fat = recipe.fat ?? "-";
  let calories = recipe.calories ?? "-";

  let summary = "";
  if (recipe.summary) {
    summary =
      recipe.summary.replace(/<[^>]+>/g, "").slice(0, 120) +
      (recipe.summary.length > 120 ? "..." : "");
  }

  return {
    ...recipe,
    protein,
    carbs,
    fat,
    calories,
    summary,
    diets: recipe.diets || [],
    tags: recipe.tags || [],
    readyInMinutes: recipe.readyInMinutes || recipe.cookingMinutes || 30,
  };
}

export default function RecipeCard({ recipe }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all hover:-translate-y-[0.30rem] duration-300 p-0 w-full max-w-xs flex flex-col border border-gray-100">
      <img
        src={recipe.image}
        alt={recipe.title}
        className="rounded-t-2xl h-44 w-full object-cover"
      />
      <div className="p-5 flex flex-col h-full flex-1">
        <h3 className="font-bold text-xl mb-1">{recipe.title}</h3>
        <p className="text-gray-600 text-sm mb-3">{recipe.summary}</p>
        <div className="flex items-center text-gray-500 text-sm mb-3 gap-4">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" /> {recipe.readyInMinutes} min
          </span>
          <span className="flex items-center gap-1">
            <Flame className="w-4 h-4 text-red-500" />{" "}
            {recipe.calories !== "-" ? `${recipe.calories} cal` : "-"}
          </span>
        </div>
        <div className="flex gap-2 mb-4 flex-wrap">
          {recipe.diets.map((d) => (
            <span
              key={d}
              className="bg-gray-100 rounded-lg px-2 py-0.5 text-xs font-semibold text-gray-700 capitalize"
            >
              {d}
            </span>
          ))}
          {recipe.dishTypes.map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 rounded-lg px-2 py-0.5 text-xs font-semibold text-gray-700 capitalize"
            >
              {tag}
            </span>
          ))}
        </div>
        {/* FOOTER FIXE EN BAS */}
        <div className="mt-auto flex flex-col gap-2">
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <div className="font-bold text-green-600 text-base">
                {recipe.protein !== "-" ? `${recipe.protein}g` : "-"}
              </div>
              <div className="text-gray-500">Protéines</div>
            </div>
            <div>
              <div className="font-bold text-orange-500 text-base">
                {recipe.carbs !== "-" ? `${recipe.carbs}g` : "-"}
              </div>
              <div className="text-gray-500">Glucides</div>
            </div>
            <div>
              <div className="font-bold text-blue-700 text-base">
                {recipe.fat !== "-" ? `${recipe.fat}g` : "-"}
              </div>
              <div className="text-gray-500">Lipides</div>
            </div>
          </div>
          <Link
            to={`/recette/${recipe.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block text-center bg-green-600 text-white rounded-xl font-semibold py-2 hover:bg-green-700 transition"
          >
            Voir la recette
          </Link>
        </div>
      </div>
    </div>
  );
}