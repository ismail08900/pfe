import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";

export default function CustomRecipe() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(location.state?.recipe || null);
  const [loading, setLoading] = useState(!recipe);

  useEffect(() => {
    if (!recipe) {
      // Si la recette n'a pas été passée dans le state (ex: rechargement de page), on la cherche dans le planning
      api.get("/planning")
        .then((res) => {
          const planning = res.data.planning || {};
          let foundRecipe = null;
          // Parcourt tout le planning pour trouver l'ID correspondant
          Object.values(planning).forEach((dayData) => {
            if (dayData) {
              Object.values(dayData).forEach((mealData) => {
                if (mealData && mealData.id === id) {
                  foundRecipe = mealData;
                }
              });
            }
          });
          if (foundRecipe) {
            setRecipe(foundRecipe);
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id, recipe]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="text-center mt-20 text-gray-500">
        <h2 className="text-2xl font-bold mb-4">Repas non trouvé</h2>
        <button className="btn btn-primary" onClick={() => navigate("/planning")}>
          Retour au planning
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20 pt-24 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {recipe.image && (
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-64 object-cover"
          />
        )}
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-4xl font-extrabold text-gray-900 capitalize">
              {recipe.title}
            </h1>
            <button
              onClick={() => navigate("/planning")}
              className="text-gray-500 hover:text-gray-900 font-medium border rounded-lg px-4 py-2"
            >
              Retour au Planning
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-green-50 p-4 rounded-xl text-center border border-green-100">
              <span className="block text-green-800 font-bold text-2xl">
                {recipe.calories}
              </span>
              <span className="text-sm text-green-600 font-medium">kcal</span>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-100">
              <span className="block text-blue-800 font-bold text-2xl">
                {recipe.protein}g
              </span>
              <span className="text-sm text-blue-600 font-medium">Protéines</span>
            </div>
            <div className="bg-yellow-50 p-4 rounded-xl text-center border border-yellow-100">
              <span className="block text-yellow-800 font-bold text-2xl">
                {recipe.carbs}g
              </span>
              <span className="text-sm text-yellow-600 font-medium">Glucides</span>
            </div>
            <div className="bg-red-50 p-4 rounded-xl text-center border border-red-100">
              <span className="block text-red-800 font-bold text-2xl">
                {recipe.fat}g
              </span>
              <span className="text-sm text-red-600 font-medium">Lipides</span>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">
              Ingrédients sélectionnés
            </h2>
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              <ul className="space-y-3">
                {recipe.ingredients.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <span className="font-medium text-lg text-gray-700">{item.food?.name}</span>
                    <span className="text-gray-500 font-bold bg-white px-3 py-1 rounded shadow-sm">
                      {item.qty} {item.food?.unit}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">Aucun ingrédient détaillé n'a été sauvegardé pour ce repas.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
