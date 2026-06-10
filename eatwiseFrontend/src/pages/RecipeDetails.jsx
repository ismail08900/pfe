import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { ArrowLeftCircle, Clock, Users } from "lucide-react";
import AddToPlanningButton from "../components/AddToPlanningButton";

function NutritionBar({ label, value, max, unit, color }) {
  const percent = max && value ? Math.min(100, (value / max) * 100) : 100;
  return (
    <div className="mb-2">
      <div className="flex justify-between items-center">
        <span className="font-medium">{label}</span>
        <span className="font-semibold text-gray-900">{value}{unit}</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full mt-1 mb-2">
        <div
          className="h-2 rounded-full transition-all"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function getNutritionMap(recipe) {
  const map = {};
  if (!recipe) return map;

  if (recipe.nutrition && recipe.nutrition.nutrients) {
    recipe.nutrition.nutrients.forEach((n) => {
      const name = n.name.toLowerCase();
      if (name.includes("calories")) map.calories = n.amount;
      if (name === "protein") map.protein = n.amount;
      if (name === "carbohydrates") map.carbs = n.amount;
      if (name === "fat") map.fat = n.amount;
      if (name === "fiber") map.fiber = n.amount;
      if (name === "cholesterol") map.cholesterol = n.amount;
      if (name === "sugar") map.sugar = n.amount;
      if (name === "sodium") map.sodium = n.amount;
      if (name === "vitamin a") map.vitaminA = n.amount;
      if (name === "vitamin c") map.vitaminC = n.amount;
      if (name === "vitamin d") map.vitaminD = n.amount;
      if (name === "vitamin b12") map.vitaminB12 = n.amount;
      if (name === "vitamin b6") map.vitaminB6 = n.amount;
      if (name === "vitamin e") map.vitaminE = n.amount;
      if (name === "vitamin k") map.vitaminK = n.amount;
      if (name === "calcium") map.calcium = n.amount;
      if (name === "iron") map.iron = n.amount;
      if (name === "potassium") map.potassium = n.amount;
      if (name === "magnesium") map.magnesium = n.amount;
      if (name === "zinc") map.zinc = n.amount;
    });
  } else {
    if (recipe.calories !== undefined) map.calories = recipe.calories;
    if (recipe.protein !== undefined) map.protein = recipe.protein;
    if (recipe.carbs !== undefined) map.carbs = recipe.carbs;
    if (recipe.fat !== undefined) map.fat = recipe.fat;
    if (recipe.fiber !== undefined) map.fiber = recipe.fiber;
  }
  return map;
}

function InfoCard({ icon, label, value, unit }) {
  return (
    <div className="flex items-center gap-3 border border-gray-300 rounded-xl px-5 py-3 mb-4 shadow-sm w-full">
      <div className="flex-shrink-0 text-green-600">{icon}</div>
      <div>
        <div className="text-gray-500 text-base font-medium">{label}</div>
        <div className="text-green-900 text-2xl font-bold">
          {value} <span className="text-base font-bold">{unit}</span>
        </div>
      </div>
    </div>
  );
}

export default function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/recipes/${id}`)
      .then((res) => {
        setRecipe(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        navigate("/404");
      });
  }, [id, navigate]);

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="text-lg font-bold text-gray-600">
          Chargement&nbsp;
          <span className="loading loading-spinner loading-md"></span>
        </div>
      </div>
    );

  if (!recipe) return null;

  const nutrition = getNutritionMap(recipe);
  const NUTRITION_MAX = {
    calories: 800,
    protein: 40,
    carbs: 100,
    fat: 40,
    fiber: 20,
    cholesterol: 150,
    sugar: 40,
    sodium: 2000,
    vitaminA: 1500,
    vitaminC: 90,
    vitaminD: 20,
    vitaminB12: 6,
    vitaminB6: 2,
    vitaminE: 15,
    vitaminK: 120,
    calcium: 1200,
    iron: 15,
    potassium: 3500,
    magnesium: 400,
    zinc: 15,
  };

  const nutritionFields = [
    { key: "calories", label: "Calories", unit: " kcal", color: "#f97316" },
    { key: "protein", label: "Protéines", unit: "g", color: "#22c55e" },
    { key: "carbs", label: "Glucides", unit: "g", color: "#3b82f6" },
    { key: "fat", label: "Lipides", unit: "g", color: "#eab308" },
    { key: "fiber", label: "Fibres", unit: "g", color: "#22c55e" },
    { key: "cholesterol", label: "Cholestérol", unit: "mg", color: "#fbbf24" },
    { key: "sugar", label: "Sucres", unit: "g", color: "#ef4444" },
    { key: "sodium", label: "Sodium", unit: "mg", color: "#6366f1" },
    { key: "vitaminA", label: "Vitamine A", unit: "IU", color: "#f59e42" },
    { key: "vitaminC", label: "Vitamine C", unit: "mg", color: "#22d3ee" },
    { key: "vitaminD", label: "Vitamine D", unit: "µg", color: "#fde047" },
    { key: "vitaminB12", label: "Vitamine B12", unit: "µg", color: "#a21caf" },
    { key: "vitaminB6", label: "Vitamine B6", unit: "mg", color: "#f472b6" },
    { key: "vitaminE", label: "Vitamine E", unit: "mg", color: "#38bdf8" },
    { key: "vitaminK", label: "Vitamine K", unit: "µg", color: "#84cc16" },
    { key: "calcium", label: "Calcium", unit: "mg", color: "#e0e7ff" },
    { key: "iron", label: "Fer", unit: "mg", color: "#6d28d9" },
    { key: "potassium", label: "Potassium", unit: "mg", color: "#fde68a" },
    { key: "magnesium", label: "Magnésium", unit: "mg", color: "#34d399" },
    { key: "zinc", label: "Zinc", unit: "mg", color: "#9ca3af" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-2">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8 border-y-4 border-green-600 flex flex-col">
        {/* IMAGE & SUMMARY FLEX */}
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center md:block w-full md:w-80">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="rounded-2xl w-full md:w-80 h-64 object-cover border"
            />

            {/* Sous l'image : cartes une sous l'autre */}
            <div className="w-full mt-6 flex flex-col gap-2">
              <InfoCard
                icon={<Clock className="w-7 h-7" />}
                label="Préparation"
                value={recipe.readyInMinutes || recipe.cookingMinutes || 30}
                unit="min"
              />
              <InfoCard
                icon={<Users className="w-7 h-7" />}
                label="Portions"
                value={recipe.servings}
                unit={recipe.servings > 1 ? "portions" : "portion"}
              />
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-start">
            <h2 className="font-extrabold text-2xl md:text-3xl mb-2 text-gray-900">
              {recipe.title}
            </h2>
            <div className="text-gray-700 text-base font-normal mb-2 leading-relaxed">
              <span
                dangerouslySetInnerHTML={{
                  __html: recipe.summary,
                }}
              />
            </div>
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-2">
              {recipe.diets?.map((d) => (
                <span
                  key={d}
                  className="bg-gray-100 rounded-lg px-2 py-0.5 text-xs font-semibold text-gray-700 capitalize"
                >
                  {d}
                </span>
              ))}
              {recipe.dishTypes?.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 rounded-lg px-2 py-0.5 text-xs font-semibold text-gray-700 capitalize"
                >
                  {tag}
                </span>
              ))}
            </div>
            
          </div>
        </div>
        {/* NUTRITION */}
        <div className="mt-8 mb-6 rounded-2xl border border-green-100 bg-green-50 p-6">
          <h3 className="font-bold text-xl mb-1 text-gray-900">Informations nutritionnelles</h3>
          <div className="text-gray-500 text-sm mb-5">Par portion</div>
          {nutritionFields.map(
            ({ key, label, unit, color }) =>
              nutrition[key] !== undefined && (
                <NutritionBar
                  key={key}
                  label={label}
                  value={nutrition[key]}
                  max={NUTRITION_MAX[key]}
                  unit={unit}
                  color={color}
                />
              )
          )}
        </div>
        {/* INGREDIENTS */}
        <div className="mb-8">
          <h3 className="font-bold text-xl mb-3">Ingrédients</h3>
          <ul className="list-disc pl-6 space-y-1 text-gray-800">
            {recipe.extendedIngredients?.map((ing) => (
              <li key={ing.id || ing.name}>
                {ing.original}
              </li>
            ))}
          </ul>
        </div>
        {/* INSTRUCTIONS */}
        <div>
          <h3 className="font-bold text-xl mb-3">Instructions</h3>
          {recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0 ? (
            <ol className="list-decimal pl-6 space-y-2 text-gray-800">
              {recipe.analyzedInstructions[0].steps.map((step) => (
                <li key={step.number}>{step.step}</li>
              ))}
            </ol>
          ) : (
            <div className="text-gray-500">Aucune instruction détaillée disponible.</div>
          )}
        </div>
        {/* AJOUTER AU PLANNING */}
        <AddToPlanningButton recipe={recipe} />
      </div>
    </div>
  );
}