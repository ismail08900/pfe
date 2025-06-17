import { useEffect, useState } from "react";
import api from "../api";
import {Link} from "react-router-dom";

function Nutrient({ label, value, unit, color }) {
  return (
    <div className="flex flex-col items-center px-2">
      <span className={`text-sm font-semibold ${color}`}>
        {Math.round(value || 0)}
        {unit}
      </span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}

const MEAL_LABELS = {
  breakfast: "Petit-déjeuner",
  lunch: "Déjeuner",
  dinner: "Dîner",
  snack: "Collation",
};

const MEAL_ORDER = ["breakfast", "lunch", "dinner", "snack"];

export default function MealsOfTheDaySection() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get("/planning/today");
        
        // Créer un tableau avec tous les types de repas, même vides
        const mealsArray = MEAL_ORDER.map(mealType => {
          const mealData = response.data[mealType];
          return mealData ? {
            ...mealData,
            type: mealType
          } : {
            type: mealType,
            title: null,
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            image: null
          };
        });

        setMeals(mealsArray);
      } catch (err) {
        console.error("Erreur lors de la récupération des repas:", err);
        setError("Impossible de charger les repas du jour");
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold mb-1">Repas du jour</h2>
      <p className="text-gray-500 text-base mb-6">
        Voici le détail de ce que tu as prévu aujourd'hui.
      </p>
      {loading ? (
        <div className="text-center text-gray-400 text-base mt-4">
          Chargement…
        </div>
      ) : error ? (
        <div className="text-center text-red-500 text-base mt-4">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {meals.map((meal, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center group transition hover:shadow-lg hover:-translate-y-1"
            >
              <div className="w-48 h-28 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                {meal.image ? (
                  <img
                    src={meal.image}
                    alt={meal.title}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="text-gray-300 text-6xl">🍽️</div>
                )}
              </div>
              <span className="text-sm text-indigo-500 font-bold mb-1 tracking-wide uppercase">
                {MEAL_LABELS[meal.type] || meal.type}
              </span>
              {meal.title ? (
                <>
                  <span className="text-lg font-semibold text-gray-800 mb-2 text-center">
                    {meal.title}
                  </span>
                  <div className="flex justify-center gap-3 w-full mt-2">
                    <Nutrient
                      label="Kcal"
                      value={meal.calories}
                      unit=""
                      color="text-orange-500"
                    />
                    <Nutrient
                      label="Prot"
                      value={meal.protein}
                      unit="g"
                      color="text-green-600"
                    />
                    <Nutrient
                      label="Gluc"
                      value={meal.carbs}
                      unit="g"
                      color="text-yellow-500"
                    />
                    <Nutrient
                      label="Lip"
                      value={meal.fat}
                      unit="g"
                      color="text-blue-500"
                    />
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-400 mt-2">
                  <p className="text-sm">Aucun repas prévu</p>
                  <p className="text-xs mt-1">Cliquez pour <Link to={"/user-recipes"}><span className="underline font-medium">ajouter un repas</span></Link></p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
