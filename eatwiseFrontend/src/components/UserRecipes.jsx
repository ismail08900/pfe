import React, { useEffect, useState } from "react";
import api from "../api";
import { Clock, Flame } from "lucide-react";

// Utilitaire pour formater proprement une recette
function formatRecipe(recipe) {
  // Les valeurs sont déjà prêtes depuis le backend
  let protein = recipe.protein ?? "-";
  let carbs = recipe.carbs ?? "-";
  let fat = recipe.fat ?? "-";
  let calories = recipe.calories ?? "-";

  // Nettoyage du résumé HTML
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

function RecipeCard({ recipe }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-0 w-full max-w-xs flex flex-col border border-gray-100">
      <img
        src={recipe.image}
        alt={recipe.title}
        className="rounded-t-2xl h-44 w-full object-cover"
      />
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-xl mb-1">{recipe.title}</h3>
        <p className="text-gray-600 text-sm mb-3">{recipe.summary}</p>
        <div className="flex items-center text-gray-500 text-sm mb-3 gap-4">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" /> {recipe.readyInMinutes} min
          </span>
          <span className="flex items-center gap-1">
            <Flame className="w-4 h-4 text-orange-500" />{" "}
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
          {recipe.tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 rounded-lg px-2 py-0.5 text-xs font-semibold text-gray-700 capitalize"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs mb-4">
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
        <a
          href={recipe.sourceUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto block text-center bg-green-600 text-white rounded-xl font-semibold py-2 hover:bg-green-700 transition"
        >
          Voir la recette
        </a>
      </div>
    </div>
  );
}

export default function UserRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/user-recipes")
      .then((res) => {
        setRecipes(res.data.results || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center">
        <div className=" text-xl font-bold text-gray-600">
          Chargement&nbsp;&nbsp;&nbsp;<span className="loading loading-dots loading-lg"></span>
        </div>
      </div>
    );

  return (
    <div className="bg-gray-50 mt-20 pt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Plats compatibles avec ton profil
      </h2>
      <div className="flex flex-wrap justify-center gap-8">
        {recipes.length === 0 ? (
          <div className="text-gray-500 text-lg">
            Aucune recommandation trouvée pour l'instant.
          </div>
        ) : (
          recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={formatRecipe(recipe)} />
          ))
        )}
      </div>
    </div>
  );
}
