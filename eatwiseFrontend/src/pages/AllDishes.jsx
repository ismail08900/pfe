import { useEffect, useState } from "react";
import api from "../api";
import DishCard from "../components/DishCard";
import {
  Loader2,
  Filter,
  RotateCcw,
  CookingPot,
  CheckCheck,
  FunnelX,
  Plus,
  Minus,
  TriangleAlert,
} from "lucide-react";

const FILTERS_DEFAULT = {
  min_calories: 0,
  min_proteins: 0,
  min_lipids: 0,
  min_carbs: 0,
  max_price: 500,
  type: "",
};

const MEAL_TYPES = [
  { value: "", label: "Tous les types" },
  { value: "petit dejeuner", label: "Petit Déjeuner" },
  { value: "dejeuner", label: "Déjeuner" },
  { value: "diner", label: "Dîner" },
  { value: "collation", label: "Collation" },
];

function RangeSlider({
  label,
  min,
  max,
  value,
  onChange,
  step = 1,
  unit,
  color,
}) {
  return (
    <div className="flex flex-col items-center w-44">
      <span className="text-sm mb-2 font-semibold">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        step={step}
        onChange={onChange}
        className={`range text-white [--range-bg:gainsboro] [--range-thumb:black] [--range-fill:0] w-full`}
      />
      <span className={`font-bold text-${color}`}>
        {value}
        {unit}
      </span>
    </div>
  );
}

export default function AllDishes() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ ...FILTERS_DEFAULT });
  const [pendingFilters, setPendingFilters] = useState({ ...FILTERS_DEFAULT });
  const [showFilters, setShowFilters] = useState(false);

  function fetchDishes(customFilters = null) {
    setLoading(true);
    setError("");
    const params = customFilters || filters;
    const query = Object.entries(params)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join("&");
    api
      .get(`/dishes-user?${query}`)
      .then((res) => setDishes(res.data))
      .catch(() => setError("Erreur lors du chargement des plats."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchDishes();
    // eslint-disable-next-line
  }, []);

  function handleApplyFilters(e) {
    if (e) e.preventDefault();
    setFilters({ ...pendingFilters });
    fetchDishes({ ...pendingFilters });
  }

  function resetFilters() {
    setPendingFilters({ ...FILTERS_DEFAULT });
    setFilters({ ...FILTERS_DEFAULT });
    fetchDishes({ ...FILTERS_DEFAULT });
  }

  // Sync pendingFilters with filters when filters change (ex: après reset)
  useEffect(() => {
    setPendingFilters({ ...filters });
  }, [showFilters]);

  return (
    <div className="bg-gray-50 min-h-screen pt-16">
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <h2 className="text-4xl text-center font-bold text-gray-900 mt-8 mb-2">
          Plats compatibles avec votre profil
        </h2>
        <p className="text-gray-600 text-center">
          Affinez votre recherche par ingrédients, cuisine, type de repas,
          temps, calories, macronutriments.
        </p>
        <div className="flex justify-between mt-8">
          <span className="flex text-md text-red-600">
            <TriangleAlert className="w-6 h-6 mr-2" />
            Les plats sont déjà filtrés en fonction de votre régime alimentaire
            et de vos allergies.
          </span>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-4 py-2 rounded-xl shadow-sm transition-all duration-300"
          >
            {showFilters ? (
              <FunnelX className="w-5 h-5" />
            ) : (
              <Filter className="w-5 h-5" />
            )}
            {showFilters ? "Masquer" : "Filtrer"}
          </button>
        </div>
        {showFilters && (
          <form
            className="w-full bg-white rounded-3xl shadow-lg p-8 mb-10 mt-8 flex flex-col gap-8 border border-green-100 animate-fade-in"
            onSubmit={handleApplyFilters}
          >
            <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-6 mb-4">
              <RangeSlider
                label="Calories min"
                min={0}
                max={1500}
                value={pendingFilters.min_calories}
                onChange={(e) =>
                  setPendingFilters((f) => ({
                    ...f,
                    min_calories: Number(e.target.value),
                  }))
                }
                unit=" kcal"
                step={10}
              />
              <RangeSlider
                label="Protéines min"
                min={0}
                max={100}
                value={pendingFilters.min_proteins}
                onChange={(e) =>
                  setPendingFilters((f) => ({
                    ...f,
                    min_proteins: Number(e.target.value),
                  }))
                }
                unit=" g"
              />
              <RangeSlider
                label="Lipides min"
                min={0}
                max={100}
                value={pendingFilters.min_lipids}
                onChange={(e) =>
                  setPendingFilters((f) => ({
                    ...f,
                    min_lipids: Number(e.target.value),
                  }))
                }
                unit=" g"
              />
              <RangeSlider
                label="Glucides min"
                min={0}
                max={200}
                value={pendingFilters.min_carbs}
                onChange={(e) =>
                  setPendingFilters((f) => ({
                    ...f,
                    min_carbs: Number(e.target.value),
                  }))
                }
                unit=" g"
              />
              <RangeSlider
                label="Prix max (DH)"
                min={0}
                max={500}
                value={pendingFilters.max_price}
                onChange={(e) =>
                  setPendingFilters((f) => ({
                    ...f,
                    max_price: Number(e.target.value),
                  }))
                }
                unit=" DH"
              />
            </div>
            <div className="flex flex-row gap-4 items-center mt-4 w-full">
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-xl shadow-sm transition-all duration-200"
                >
                  <CheckCheck className="w-5 h-5" />
                  Appliquer
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 bg-white border border-gray-800 text-gray-800 font-medium px-4 py-2 rounded-xl shadow-sm transition-all duration-200"
                  onClick={resetFilters}
                >
                  <RotateCcw className="w-5 h-5" />
                  Réinitialiser
                </button>
              </div>
              <div className="flex-1 flex justify-end">
                <label className="text-gray-700 text-sm font-bold mb-2 tracking-wide block">
                  Type de repas
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <CookingPot size={18} />
                  </span>
                  <select
                    className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 appearance-none text-base bg-white"
                    value={pendingFilters.type}
                    onChange={(e) =>
                      setPendingFilters((f) => ({
                        ...f,
                        type: e.target.value,
                      }))
                    }
                  >
                    {MEAL_TYPES.map((t) => (
                      <option value={t.value} key={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </form>
        )}
        {loading ? (
          <div className="h-40 flex justify-center items-center">
            <div className="text-lg font-bold mt-32">
              Chargement&nbsp;
              <span className="loading loading-spinner loading-md"></span>
            </div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">{error}</div>
        ) : dishes.length === 0 ? (
          <div className="mt-10 text-center text-gray-500 py-12">
            Aucun plat trouvé pour ces critères.
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {dishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
