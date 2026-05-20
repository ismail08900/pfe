import React, { useEffect, useState, useRef } from "react";
import api from "../api";
import RecipeCard, { formatRecipe } from "../components/RecipeCard";
import {
  CheckCheck,
  ChefHat,
  ChevronDown,
  ChevronUp,
  CookingPot,
  Filter,
  FunnelX,
  Minus,
  Plus,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";
import { INGREDIENT_GROUPS, CUISINES, MEAL_TYPES } from "../utils/filter";
import {
  INGREDIENT_LABELS,
  INGREDIENT_GROUP_LABELS_FR,
} from "../utils/ingredientLabels";
import {
  CUISINE_LABELS_FR,
  MEAL_TYPE_LABELS_FR,
} from "../utils/cuisineMealLabels";

function IngredientDropdownItem({ children, onClick, color }) {
  return (
    <button
      type="button"
      className={`w-full text-left px-3 py-1 hover:bg-${color}-100 hover:text-${color}-800 transition rounded text-sm`}
      onClick={onClick}
      tabIndex={-1}
    >
      {children}
    </button>
  );
}

function IngredientGroupDropdown({
  show,
  setShow,
  selectedGroup,
  setSelectedGroup,
  onIngredientSelect,
  dropdownRef,
  color,
}) {
  return show ? (
    <div
      className={`absolute z-40 mt-1 left-0 w-full max-h-64 overflow-y-auto bg-white rounded-xl shadow-lg animate-fade-in`}
      ref={dropdownRef}
    >
      {!selectedGroup ? (
        <div>
          {Object.keys(INGREDIENT_GROUPS).map((group) => (
            <IngredientDropdownItem
              key={group}
              onClick={() => setSelectedGroup(group)}
              color={`${color}`}
            >
              {INGREDIENT_GROUP_LABELS_FR[group] || group}
            </IngredientDropdownItem>
          ))}
        </div>
      ) : (
        <div>
          <button
            className="text-xs text-gray-600 px-3 py-1 hover:underline mb-1"
            type="button"
            onClick={() => setSelectedGroup(null)}
          >
            ← Retour aux groupes
          </button>
          {INGREDIENT_GROUPS[selectedGroup].map((ing) => (
            <IngredientDropdownItem
              key={ing}
              onClick={() => {
                onIngredientSelect(ing);
                setShow(false);
                setSelectedGroup(null);
              }}
            >
              {INGREDIENT_LABELS[ing] || ing}
            </IngredientDropdownItem>
          ))}
        </div>
      )}
    </div>
  ) : null;
}

function RangeInput({
  label,
  value,
  onChange,
  min,
  max,
  unit,
  color,
  id,
  step = 1,
}) {
  return (
    <div className="flex flex-col items-center w-44">
      <span className="text-sm mb-2 font-semibold">{label}</span>
      <input
        id={id}
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

function FilterBar({
  filters,
  setFilters,
  onFilter,
  loading,
  resetFilters,
  show,
  showListInclude,
  setShowListInclude,
  showListExclude,
  setShowListExclude,
  includeGroup,
  setIncludeGroup,
  excludeGroup,
  setExcludeGroup,
  showSliders,
  setShowSliders,
}) {
  const includeDropdownRef = useRef();
  const includeButtonRef = useRef();
  const excludeDropdownRef = useRef();
  const excludeButtonRef = useRef();
  const [focusedSelect, setFocusedSelect] = useState(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        includeDropdownRef.current &&
        !includeDropdownRef.current.contains(event.target) &&
        includeButtonRef.current &&
        !includeButtonRef.current.contains(event.target)
      ) {
        setShowListInclude(false);
        setIncludeGroup(null);
      }
      if (
        excludeDropdownRef.current &&
        !excludeDropdownRef.current.contains(event.target) &&
        excludeButtonRef.current &&
        !excludeButtonRef.current.contains(event.target)
      ) {
        setShowListExclude(false);
        setExcludeGroup(null);
      }
    }
    if (showListInclude || showListExclude) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [
    showListInclude,
    showListExclude,
    setShowListInclude,
    setShowListExclude,
    setIncludeGroup,
    setExcludeGroup,
  ]);

  if (!show) return null;

  // Helpers to display ingredients in French in the input (visual only)
  function displayIngredientsFr(ingredientsStr) {
    if (!ingredientsStr) return "";
    return ingredientsStr
      .split(",")
      .map((x) => INGREDIENT_LABELS[x.trim()] || x.trim())
      .join(", ");
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onFilter();
      }}
      className="w-full bg-white rounded-3xl shadow-lg p-6 mt-8 mb-10 flex flex-col gap-5 backdrop-blur-md relative z-10 animate-fade-in"
    >
      {/* 1: Include & Exclude */}
      <div className="w-full flex flex-col md:flex-row gap-6 items-center">
        <div className="relative flex-1 min-w-[200px]" ref={includeDropdownRef}>
          <label className="text-gray-700 text-sm font-bold mb-2 tracking-wide block">
            Ingrédients à inclure
          </label>
          <div className="flex">
            <input
              type="text"
              className="w-full border-green-600 pl-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 placeholder:text-gray-400 bg-white text-base"
              placeholder="ex. poulet, riz, pomme, ..."
              value={displayIngredientsFr(filters.includeIngredients)}
              onChange={(e) => {
                setFilters((f) => ({
                  ...f,
                  includeIngredients: e.target.value
                    .split(",")
                    .map((val) => {
                      const foundEn = Object.entries(INGREDIENT_LABELS).find(
                        ([fr]) => fr.toLowerCase() === val.trim().toLowerCase()
                      );
                      return foundEn ? foundEn[0] : val.trim();
                    })
                    .join(","),
                }));
              }}
            />
            <button
              ref={includeButtonRef}
              type="button"
              className="btn ml-2 bg-green-600 hover:bg-green-700 text-white rounded-xl"
              onClick={() => setShowListInclude((v) => !v)}
              tabIndex={-1}
            >
              {showListInclude ? "Cacher" : "Lister"}
            </button>
          </div>
          <IngredientGroupDropdown
            show={showListInclude}
            setShow={setShowListInclude}
            selectedGroup={includeGroup}
            setSelectedGroup={setIncludeGroup}
            onIngredientSelect={(ing) => {
              let val = filters.includeIngredients
                ? filters.includeIngredients.split(",").map((x) => x.trim())
                : [];
              if (!val.includes(ing)) {
                val.push(ing);
                setFilters((f) => ({
                  ...f,
                  includeIngredients: val.join(","),
                }));
              }
            }}
            dropdownRef={includeDropdownRef}
            color="green"
          />
        </div>
        <div className="relative flex-1 min-w-[200px]" ref={excludeDropdownRef}>
          <label className="text-gray-700 text-sm font-bold mb-2 tracking-wide block">
            Ingrédients à exclure
          </label>
          <div className="flex">
            <input
              type="text"
              className="w-full pl-4 py-2 border border-red-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 placeholder:text-gray-400 bg-white text-base"
              placeholder="ex. fromage, avocat, ..."
              value={displayIngredientsFr(filters.excludeIngredients)}
              onChange={(e) => {
                setFilters((f) => ({
                  ...f,
                  excludeIngredients: e.target.value
                    .split(",")
                    .map((val) => {
                      const foundEn = Object.entries(INGREDIENT_LABELS).find(
                        ([fr]) => fr.toLowerCase() === val.trim().toLowerCase()
                      );
                      return foundEn ? foundEn[0] : val.trim();
                    })
                    .join(","),
                }));
              }}
            />
            <button
              ref={excludeButtonRef}
              type="button"
              className="btn ml-2 bg-red-600 hover:bg-red-700 text-white rounded-xl"
              onClick={() => setShowListExclude((v) => !v)}
              tabIndex={-1}
            >
              {showListExclude ? "Cacher" : "Lister"}
            </button>
          </div>
          <IngredientGroupDropdown
            show={showListExclude}
            setShow={setShowListExclude}
            selectedGroup={excludeGroup}
            setSelectedGroup={setExcludeGroup}
            onIngredientSelect={(ing) => {
              let val = filters.excludeIngredients
                ? filters.excludeIngredients.split(",").map((x) => x.trim())
                : [];
              if (!val.includes(ing)) {
                val.push(ing);
                setFilters((f) => ({
                  ...f,
                  excludeIngredients: val.join(","),
                }));
              }
            }}
            dropdownRef={excludeDropdownRef}
            color="red"
          />
        </div>
      </div>
      {/* 2: Cuisine & Meal Type */}
      <div className="w-full flex flex-col md:flex-row gap-6 items-center">
        <div className="flex-1 min-w-[200px]">
          <label className="text-gray-700 text-sm font-bold mb-2 tracking-wide block">
            Cuisine
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <ChefHat size={18} />
            </span>
            <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 pointer-events-none">
              {focusedSelect === "cuisine" ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </span>
            <select
              onFocus={() => setFocusedSelect("cuisine")}
              onBlur={() => setFocusedSelect(null)}
              className="w-full pl-10 pr-10 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 appearance-none bg-white"
              value={filters.cuisine}
              onChange={(e) =>
                setFilters((f) => ({ ...f, cuisine: e.target.value }))
              }
            >
              <option value="">Toutes les cuisines</option>
              {CUISINES.map((cuisine) => (
                <option value={cuisine} key={cuisine}>
                  {CUISINE_LABELS_FR[cuisine] || cuisine}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="text-gray-700 text-sm font-bold mb-2 tracking-wide block">
            Type de repas
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <CookingPot size={18} />
            </span>
            <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 pointer-events-none">
              {focusedSelect === "type" ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </span>
            <select
              onFocus={() => setFocusedSelect("type")}
              onBlur={() => setFocusedSelect(null)}
              className="w-full pl-10 pr-10 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 appearance-none bg-white"
              value={filters.type}
              onChange={(e) =>
                setFilters((f) => ({ ...f, type: e.target.value }))
              }
            >
              <option value="">Tous les types</option>
              {MEAL_TYPES.map((type) => (
                <option value={type} key={type}>
                  {MEAL_TYPE_LABELS_FR[type] || type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {/* 3: Max Sliders (hide/show) */}
      {showSliders && (
        <div className="flex flex-wrap justify-center gap-8 w-full mt-2 animate-fade-in">
          <RangeInput
            label="Max Calories"
            value={filters.maxCalories}
            onChange={(e) =>
              setFilters((f) => ({ ...f, maxCalories: e.target.value }))
            }
            min={0}
            max={1500}
            unit=" kcal"
            color="red-500"
            id="filter-cal"
            step={10}
          />
          <RangeInput
            label="Max Protéines"
            value={filters.maxProtein}
            onChange={(e) =>
              setFilters((f) => ({ ...f, maxProtein: e.target.value }))
            }
            min={0}
            max={120}
            unit=" g"
            color="green-600"
            id="filter-protein"
          />
          <RangeInput
            label="Max Glucides"
            value={filters.maxCarbs}
            onChange={(e) =>
              setFilters((f) => ({ ...f, maxCarbs: e.target.value }))
            }
            min={0}
            max={120}
            unit=" g"
            color="orange-500"
            id="filter-carbs"
          />
          <RangeInput
            label="Max Lipides"
            value={filters.maxFat}
            onChange={(e) =>
              setFilters((f) => ({ ...f, maxFat: e.target.value }))
            }
            min={0}
            max={120}
            unit=" g"
            color="blue-700"
            id="filter-fat"
          />
          <RangeInput
            label="Prêt au max"
            value={filters.maxTime}
            onChange={(e) =>
              setFilters((f) => ({ ...f, maxTime: e.target.value }))
            }
            min={0}
            max={240}
            unit=" min"
            color="black"
            id="filter-time"
          />
        </div>
      )}
      {/* 4: Min Sliders (hide/show) */}
      {showSliders && (
        <div className="flex flex-wrap justify-center gap-8 w-full mt-2 animate-fade-in">
          <RangeInput
            label="Min Calories"
            value={filters.minCalories}
            onChange={(e) =>
              setFilters((f) => ({ ...f, minCalories: e.target.value }))
            }
            min={0}
            max={1500}
            unit=" kcal"
            color="red-500"
            id="filter-min-cal"
            step={10}
          />
          <RangeInput
            label="Min Protéines"
            value={filters.minProtein}
            onChange={(e) =>
              setFilters((f) => ({ ...f, minProtein: e.target.value }))
            }
            min={0}
            max={120}
            unit=" g"
            color="green-600"
            id="filter-min-protein"
          />
          <RangeInput
            label="Min Glucides"
            value={filters.minCarbs}
            onChange={(e) =>
              setFilters((f) => ({ ...f, minCarbs: e.target.value }))
            }
            min={0}
            max={120}
            unit=" g"
            color="orange-500"
            id="filter-min-carbs"
          />
          <RangeInput
            label="Min Lipides"
            value={filters.minFat}
            onChange={(e) =>
              setFilters((f) => ({ ...f, minFat: e.target.value }))
            }
            min={0}
            max={120}
            unit=" g"
            color="blue-700"
            id="filter-min-fat"
          />
          <RangeInput
            label="Min Portions"
            value={filters.minServings}
            onChange={(e) =>
              setFilters((f) => ({ ...f, minServings: e.target.value }))
            }
            min={0}
            max={50}
            unit={` portion${filters.minServings > 1 ? "s" : ""}`}
            color="black"
            id="filter-min-servings"
          />
        </div>
      )}
      {/* 5: Buttons */}
      <div className="flex flex-row gap-4 items-center mt-4 w-full">
        <div className="flex gap-4">
          <button
            type="submit"
            className={`btn flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-xl shadow-sm transition-all duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            <CheckCheck className="w-5 h-5" />
            Appliquer
          </button>
          <button
            type="button"
            className={`btn flex items-center gap-2 bg-white border border-gray-800 text-gray-800 font-medium px-4 py-2 rounded-xl shadow-sm transition-all duration-200${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={resetFilters}
          >
            <RotateCcw className="w-5 h-5" />
            Réinitialiser
          </button>
        </div>
        <div className="flex-1 flex justify-end">
          <button
            type="button"
            className="btn flex items-center gap-2 bg-white border-2 border-gray-800 text-gray-800 px-2 py-2 rounded-full shadow-sm"
            onClick={() => setShowSliders((v) => !v)}
          >
            {showSliders ? (
              <Minus className="w-5 h-5" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

export default function UserRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    includeIngredients: "",
    excludeIngredients: "",
    cuisine: "",
    type: "",
    maxTime: "",
    maxCalories: "",
    minCalories: "",
    maxProtein: "",
    minProtein: "",
    maxCarbs: "",
    minCarbs: "",
    maxFat: "",
    minFat: "",
    minServings: "",
  });

  const [showFilters, setShowFilters] = useState(false);
  const [showListInclude, setShowListInclude] = useState(false);
  const [showListExclude, setShowListExclude] = useState(false);
  const [includeGroup, setIncludeGroup] = useState(null);
  const [excludeGroup, setExcludeGroup] = useState(null);
  const [showSliders, setShowSliders] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    fetchRecipes();
    // eslint-disable-next-line
  }, []);

  async function generateAIRecipe() {
    setLoadingAI(true);
    try {
      const ingredientsList = filters.includeIngredients
        ? filters.includeIngredients.split(",").map((i) => i.trim())
        : ["ingrédients surprises"];
      
      const response = await api.post("/ai/generate-recipe", {
        ingredients: ingredientsList,
      });

      if (response.data && response.data.results) {
        // Ajouter la recette générée au début de la liste
        setRecipes((prev) => [...response.data.results, ...prev]);
      }
    } catch (error) {
      console.error("Erreur de génération IA :", error);
      alert("Erreur lors de la génération de la recette avec l'IA.");
    } finally {
      setLoadingAI(false);
    }
  }

  function fetchRecipes(customFilters = null) {
    setLoading(true);
    const f = customFilters || filters;
    const params = {};
    if (f.includeIngredients && f.includeIngredients.trim() !== "")
      params.includeIngredients = f.includeIngredients;
    if (f.excludeIngredients && f.excludeIngredients.trim() !== "")
      params.excludeIngredients = f.excludeIngredients;
    if (f.cuisine && f.cuisine.trim() !== "") params.cuisine = f.cuisine;
    if (f.type && f.type.trim() !== "") params.type = f.type;
    if (f.maxTime && Number(f.maxTime) > 0)
      params.maxReadyTime = String(f.maxTime);
    if (f.maxCalories && Number(f.maxCalories) > 0)
      params.maxCalories = Number(f.maxCalories);
    if (f.minCalories && Number(f.minCalories) > 0)
      params.minCalories = Number(f.minCalories);
    if (f.maxProtein && Number(f.maxProtein) > 0)
      params.maxProtein = Number(f.maxProtein);
    if (f.minProtein && Number(f.minProtein) > 0)
      params.minProtein = Number(f.minProtein);
    if (f.maxCarbs && Number(f.maxCarbs) > 0)
      params.maxCarbs = Number(f.maxCarbs);
    if (f.minCarbs && Number(f.minCarbs) > 0)
      params.minCarbs = Number(f.minCarbs);
    if (f.maxFat && Number(f.maxFat) > 0) params.maxFat = Number(f.maxFat);
    if (f.minFat && Number(f.minFat) > 0) params.minFat = Number(f.minFat);
    if (f.minServings && Number(f.minServings) > 0)
      params.minServings = Number(f.minServings);

    api
      .get("/user-recipes", { params })
      .then((res) => {
        setRecipes(res.data.results || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  function handleFilter() {
    fetchRecipes();
  }

  function resetFilters() {
    setFilters({
      includeIngredients: "",
      excludeIngredients: "",
      cuisine: "",
      type: "",
      maxTime: "",
      maxCalories: "",
      minCalories: "",
      maxProtein: "",
      minProtein: "",
      maxCarbs: "",
      minCarbs: "",
      maxFat: "",
      minFat: "",
      minServings: "",
    });
    fetchRecipes({
      includeIngredients: "",
      excludeIngredients: "",
      cuisine: "",
      type: "",
      maxTime: "",
      maxCalories: "",
      minCalories: "",
      maxProtein: "",
      minProtein: "",
      maxCarbs: "",
      minCarbs: "",
      maxFat: "",
      minFat: "",
      minServings: "",
    });
  }

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
          {/* <button
            onClick={() => fetchRecipes()}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-xl shadow-sm transition-all duration-300 ml-52"
            title="Actualiser la liste"
          >
            <RotateCcw className="w-5 h-5" />
            Actualiser
          </button> */}
          <div className="flex gap-4">
            <button
              onClick={generateAIRecipe}
              disabled={loadingAI}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium px-4 py-2 rounded-xl shadow-sm transition-all duration-300"
            >
              {loadingAI ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <span className="text-xl">✨</span>
              )}
              Générer avec l'IA
            </button>
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
        </div>
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          onFilter={handleFilter}
          loading={loading}
          resetFilters={resetFilters}
          show={showFilters}
          showListInclude={showListInclude}
          setShowListInclude={setShowListInclude}
          showListExclude={showListExclude}
          setShowListExclude={setShowListExclude}
          includeGroup={includeGroup}
          setIncludeGroup={setIncludeGroup}
          excludeGroup={excludeGroup}
          setExcludeGroup={setExcludeGroup}
          showSliders={showSliders}
          setShowSliders={setShowSliders}
        />
        {loading ? (
          <div className="h-40 flex justify-center items-center">
            <div className="text-lg font-bold mt-32">
              Chargement&nbsp;
              <span className="loading loading-spinner loading-md"></span>
            </div>
          </div>
        ) : (
          <div className="mt-10 flex flex-wrap justify-center gap-8 min-h-[300px]">
            {recipes.length === 0 ? (
              <div className="text-gray-500 text-lg mt-8">
                Aucune recommandation trouvée pour vos critères.
              </div>
            ) : (
              recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={formatRecipe(recipe)} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
