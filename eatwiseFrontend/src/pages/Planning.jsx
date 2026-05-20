import { useEffect, useState, useRef } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { HelpCircle } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import foodDatabase from "../utils/foodDatabase";

const DAYS = [
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
  "dimanche",
];
const MEALS = [
  { key: "breakfast", label: "Petit-déj" },
  { key: "lunch", label: "Déjeuner" },
  { key: "dinner", label: "Dîner" },
  { key: "snack", label: "Collations" },
];

export default function Planning() {
  const [planning, setPlanning] = useState(null);
  const [weekStart, setWeekStart] = useState("");
  const [loading, setLoading] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);
  const helpButtonRef = useRef(null);

  // Suppression modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({
    day: null,
    meal: null,
    title: "",
  });

  // Ajout pour repas personnalisé
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customDay, setCustomDay] = useState("");
  const [customMeal, setCustomMeal] = useState("");
  const [search, setSearch] = useState("");
  const [selectedFoods, setSelectedFoods] = useState([]); // [{food, qty}]

  // Ajoute un état pour le modal de confirmation d'écrasement
  const [showOverwriteModal, setShowOverwriteModal] = useState(false);
  const [pendingCustomRecipe, setPendingCustomRecipe] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPlanning();
    //eslint-disable-next-line
  }, []);

  // Fermer l'infobulle si on clique en dehors
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        helpButtonRef.current &&
        !helpButtonRef.current.contains(event.target)
      ) {
        setShowInstructions(false);
      }
    }

    if (showInstructions) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showInstructions]);

  function fetchPlanning() {
    setLoading(true);
    api
      .get("/planning")
      .then((res) => {
        setPlanning(res.data.planning);
        setWeekStart(res.data.week_start);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  function handleAskRemove(day, meal, title) {
    setDeleteTarget({ day, meal, title });
    setShowDeleteModal(true);
  }

  function handleConfirmRemove() {
    const { day, meal } = deleteTarget;
    const updatedPlanning = {
      ...planning,
      [day]: { ...planning[day], [meal]: null },
    };
    setPlanning(updatedPlanning);
    setShowDeleteModal(false);

    // Sauvegarde immédiate à la suppression
    api
      .post("/planning", {
        week_start: weekStart,
        planning: updatedPlanning,
      })
      .then(() => {
        toast.success("Recette supprimée du planning !");
      })
      .catch(() => {
        toast.error("Erreur lors de la suppression.");
      });
  }

  // Ajoute un aliment sélectionné
  function handleAddFood(food) {
    if (selectedFoods.find((f) => f.food.name === food.name)) return;
    setSelectedFoods([...selectedFoods, { food, qty: 100 }]);
  }

  // Modifie la quantité
  function handleQtyChange(idx, qty) {
    setSelectedFoods(
      selectedFoods.map((f, i) => (i === idx ? { ...f, qty: Number(qty) } : f))
    );
  }

  // Supprime un aliment
  function handleRemoveFood(idx) {
    setSelectedFoods(selectedFoods.filter((_, i) => i !== idx));
  }

  // Calcule les totaux
  function getTotals() {
    return selectedFoods.reduce(
      (acc, { food, qty }) => {
        acc.calories += food.calories * qty;
        acc.protein += food.protein * qty;
        acc.carbs += food.carbs * qty;
        acc.fat += food.fat * qty;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }

  // Validation du repas personnalisé
  function handleSaveCustomMeal() {
    if (!customDay || !customMeal || selectedFoods.length === 0) return;
    const total = getTotals();
    const customRecipe = {
      title: "repas personnalisé",
      image:
        "https://t3.ftcdn.net/jpg/11/97/54/24/360_F_1197542478_QryfuMhhMBfFpv1XZoX7CgG0GDqA7WAy.jpg",
      calories: Math.round(total.calories),
      protein: Math.round(total.protein * 10) / 10,
      carbs: Math.round(total.carbs * 10) / 10,
      fat: Math.round(total.fat * 10) / 10,
      id: "custom_" + Date.now(),
      ingredients: selectedFoods,
    };
    // Vérifie si la cellule est déjà occupée
    if (planning[customDay][customMeal]) {
      setPendingCustomRecipe(customRecipe);
      setShowOverwriteModal(true);
      return;
    }
    // Sinon, ajoute directement
    saveCustomRecipe(customRecipe);
  }

  // Fonction pour sauvegarder le repas personnalisé (utilisée aussi par la confirmation)
  function saveCustomRecipe(customRecipe) {
    const updatedPlanning = {
      ...planning,
      [customDay]: {
        ...planning[customDay],
        [customMeal]: customRecipe,
      },
    };
    setPlanning(updatedPlanning);
    setShowCustomModal(false);
    setShowOverwriteModal(false);
    setPendingCustomRecipe(null);
    // Sauvegarde immédiate
    api
      .post("/planning", {
        week_start: weekStart,
        planning: updatedPlanning,
      })
      .then(() => {
        toast.success("Repas personnalisé ajouté !");
      })
      .catch(() => {
        toast.error("Erreur lors de l'ajout du repas personnalisé.");
      });
  }

  // --- AI AND WHATSAPP FUNCTIONS ---

  const [loadingAI, setLoadingAI] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [sendingWhatsApp, setSendingWhatsApp] = useState(false);

  async function generateAIPlanning() {
    setLoadingAI(true);
    try {
      const response = await api.post("/ai/generate-planning", {
        current_planning: planning
      });
      if (response.data && response.data.week) {
        // Le format de retour de l'IA doit correspondre au state planning
        // (qui attend un objet avec les jours contenant les repas)
        // Mais nous devons l'adapter si nécessaire
        
        // Supposons que l'IA renvoie { week: { lundi: { meals: [...] }, ... } }
        // On transforme pour le format: { lundi: { breakfast: {}, lunch: {}, dinner: {}, snack: {} }, ... }
        const newPlanning = { ...planning };
        
        DAYS.forEach((day) => {
          if (!newPlanning[day]) newPlanning[day] = {};
          const aiMeals = response.data.week[day]?.meals || [];
          
          if (aiMeals.length > 0) newPlanning[day].breakfast = aiMeals[0];
          if (aiMeals.length > 1) newPlanning[day].lunch = aiMeals[1];
          if (aiMeals.length > 2) newPlanning[day].dinner = aiMeals[2];
          if (aiMeals.length > 3) newPlanning[day].snack = aiMeals[3];
        });

        setPlanning(newPlanning);
        
        // Sauvegarde du nouveau planning en DB
        await api.post("/planning", {
          week_start: weekStart,
          planning: newPlanning,
        });

        toast.success("Planning généré par l'IA avec succès !");
      }
    } catch (error) {
      console.error("Erreur IA planning :", error);
      toast.error("Erreur lors de la génération du planning par l'IA.");
    } finally {
      setLoadingAI(false);
    }
  }

  function sendToWhatsApp() {
    let text = "🍽️ *Mon Planning Repas EatWise* 🍽️\n\n";

    let hasMeals = false;
    DAYS.forEach(day => {
      let dayText = `*${day.toUpperCase()}*\n`;
      let dayHasMeals = false;
      MEALS.forEach(meal => {
        if(planning[day] && planning[day][meal.key]) {
          dayHasMeals = true;
          hasMeals = true;
          dayText += `• _${meal.label}_: ${planning[day][meal.key].title}\n`;
        }
      });
      if (dayHasMeals) {
        text += dayText + "\n";
      }
    });

    if (!hasMeals) {
      toast.warning("Votre planning est vide !");
      return;
    }

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  }

  // --------------------------------

  return (
    <div className="bg-gray-50 min-h-screen pb-20 pt-16 px-2">
      <ToastContainer
        position="bottom-left"
        autoClose={4000}
        newestOnTop={true}
        closeOnClick={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {/* Modal suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-lg p-7 w-[380px] relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-800"
              onClick={() => setShowDeleteModal(false)}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h3 className="text-lg font-semibold mb-5 text-gray-900">
              Supprimer la recette&nbsp;
              <span className="font-bold">{deleteTarget.title}</span> ?
            </h3>
            <div className="flex gap-3 mt-2">
              <button
                className="flex-1 bg-gray-200 text-gray-700 font-bold py-2 rounded-lg hover:bg-gray-300"
                onClick={() => setShowDeleteModal(false)}
              >
                Annuler
              </button>
              <button
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg"
                onClick={handleConfirmRemove}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal WhatsApp Phone */}
      {showPhoneModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-lg p-7 w-[380px] relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-800 text-2xl"
              onClick={() => setShowPhoneModal(false)}
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <span className="text-[#25D366] text-2xl">📱</span> Numéro WhatsApp
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Veuillez entrer votre numéro de téléphone (avec le code pays, ex: +33612345678) pour recevoir votre planning.
            </p>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 mb-4"
              placeholder="+33 6 12 34 56 78"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <button
              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-2 rounded-lg transition flex justify-center items-center gap-2"
              onClick={sendToWhatsApp}
              disabled={sendingWhatsApp || !phoneNumber}
            >
              {sendingWhatsApp ? <span className="loading loading-spinner loading-sm"></span> : null}
              Envoyer sur WhatsApp
            </button>
          </div>
        </div>
      )}

      {showCustomModal && (
        <>
          <style>{`body { overflow: hidden !important; }`}</style>
          <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-lg p-7 w-[420px] relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-800 text-2xl"
                onClick={() => {
                  setShowCustomModal(false);
                  document.body.style.overflow = "";
                }}
              >
                &times;
              </button>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Créer un repas personnalisé
              </h3>
              <div className="flex gap-2 mb-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold mb-1">
                    Jour
                  </label>
                  <select
                    className="w-full border rounded-lg px-2 py-1"
                    value={customDay}
                    onChange={(e) => setCustomDay(e.target.value)}
                  >
                    {DAYS.map((day) => (
                      <option key={day} value={day}>
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold mb-1">
                    Type de repas
                  </label>
                  <select
                    className="w-full border rounded-lg px-2 py-1"
                    value={customMeal}
                    onChange={(e) => setCustomMeal(e.target.value)}
                  >
                    {MEALS.map((meal) => (
                      <option key={meal.key} value={meal.key}>
                        {meal.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 mb-3"
                placeholder="Rechercher un aliment..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="max-h-32 overflow-y-auto mb-3">
                {foodDatabase
                  .filter((f) =>
                    f.name.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((food) => (
                    <button
                      key={food.name}
                      className="block w-full text-left px-2 py-1 hover:bg-green-100 rounded text-sm"
                      onClick={() => handleAddFood(food)}
                      type="button"
                    >
                      {food.name}{" "}
                      <span className="text-gray-400">
                        ({food.calories} kcal/{food.unit})
                      </span>
                    </button>
                  ))}
              </div>
              <div className="mb-3">
                {selectedFoods.length === 0 ? (
                  <div className="text-gray-400 text-sm italic">
                    Aucun aliment sélectionné
                  </div>
                ) : (
                  <ul>
                    {selectedFoods.map((f, idx) => (
                      <li
                        key={f.food.name}
                        className="flex items-center gap-2 mb-1"
                      >
                        <span className="flex-1">{f.food.name}</span>
                        <input
                          type="number"
                          min={1}
                          value={f.qty}
                          onChange={(e) => handleQtyChange(idx, e.target.value)}
                          className="w-16 border rounded px-1 py-0.5 text-sm"
                        />
                        <span className="text-xs text-gray-500">{f.food.unit}</span>
                        <button
                          className="text-red-500 text-xs ml-2"
                          onClick={() => handleRemoveFood(idx)}
                          type="button"
                        >
                          Retirer
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="mb-4 text-sm bg-green-50 rounded p-2">
                <b>Total :</b> {getTotals().calories.toFixed(0)} kcal,{" "}
                {getTotals().protein.toFixed(1)}g prot,{" "}
                {getTotals().carbs.toFixed(1)}g gluc,{" "}
                {getTotals().fat.toFixed(1)}g lip
              </div>
              <button
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition"
                onClick={handleSaveCustomMeal}
                disabled={selectedFoods.length === 0}
              >
                Ajouter au planning
              </button>
            </div>
          </div>
        </>
      )}

      {showOverwriteModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-lg p-7 w-[380px] relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-800 text-2xl"
              onClick={() => {
                setShowOverwriteModal(false);
                setPendingCustomRecipe(null);
              }}
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Modification du repas
            </h3>
            <p className="mb-6 text-gray-700">
              La cellule sélectionnée contient déjà un repas. Voulez-vous le
              remplacer par votre repas personnalisé ?
            </p>
            <div className="flex gap-4 justify-end">
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg"
                onClick={() => {
                  setShowOverwriteModal(false);
                  setPendingCustomRecipe(null);
                }}
              >
                Annuler
              </button>
              <button
                className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-2 px-4 rounded-lg"
                onClick={() => saveCustomRecipe(pendingCustomRecipe)}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto mb-10">
        <div className="flex justify-between items-center mt-7 mb-2">
          <div className="relative" ref={helpButtonRef}>
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <HelpCircle size={24} />
              <span className="font-medium">Aide</span>
            </button>

            {/* Infobulle */}
            {showInstructions && (
              <div className="absolute left-0 top-full mt-2 w-[400px] bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-lg text-gray-900">
                      Comment utiliser le planning :
                    </h4>
                    <button
                      className="text-gray-400 hover:text-gray-800"
                      onClick={() => setShowInstructions(false)}
                    >
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>
                      <b>Ajouter une recette</b> : Va sur la page d'une recette
                      et clique sur "Ajouter au planning", puis choisis le jour
                      et le repas.
                    </li>
                    <li>
                      <b>Voir le détail d'une recette</b> : Clique sur le nom
                      d'une recette dans le planning pour accéder à sa fiche
                      détaillée.
                    </li>
                    <li>
                      <b>Supprimer une recette</b> : Clique sur "Supprimer" dans
                      la case du planning, confirme la suppression dans le
                      pop-up, et la suppression sera enregistrée
                      automatiquement.
                    </li>
                  </ul>
                </div>
                {/* Flèche de l'infobulle */}
                <div className="absolute -top-2 left-6 w-4 h-4 bg-white transform rotate-45 border-t border-l border-gray-200"></div>
              </div>
            )}
          </div>
          <h2 className="text-4xl font-bold ml-8 text-center text-gray-900">
            Planning de la semaine
          </h2>
          <div className="w-[100px]"></div> {/* Spacer pour centrer le titre */}
        </div>
        <p className="text-center text-gray-500 mb-7">
          Planifiez vos repas pour la semaine ! Pour ajouter une recette,
          utilisez le bouton sur la page de détails de la recette.
        </p>
        <div className="mb-4 flex flex-wrap gap-4 justify-start items-center">
          <button
            className="btn text-gray-900 font-semibold py-2 px-6 rounded-xl border-2 border-gray-900 text-md"
            onClick={() => {
              setCustomDay(DAYS[0]);
              setCustomMeal(MEALS[0].key);
              setShowCustomModal(true);
              setSearch("");
              setSelectedFoods([]);
            }}
          >
            Ajouter un repas personnalisé
          </button>
          
          <button
            onClick={generateAIPlanning}
            disabled={loadingAI}
            className="btn flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-2 px-6 rounded-xl border-none shadow-md"
          >
            {loadingAI ? <span className="loading loading-spinner loading-sm"></span> : <span className="text-xl">✨</span>}
            Générer avec l'IA
          </button>

          <button
            onClick={sendToWhatsApp}
            className="btn flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold py-2 px-6 rounded-xl border-none shadow-md ml-auto"
          >
            <span className="text-xl">📱</span> Envoyer sur WhatsApp
          </button>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center font-bold text-lg mt-20">
              Chargement&nbsp;
              <span className="loading loading-spinner loading-md"></span>
            </div>
          ) : (
            <table className="w-full border rounded-lg overflow-hidden bg-white shadow-xl">
              <thead>
                <tr>
                  <th className="border px-2 py-3 bg-gray-100"></th>
                  {DAYS.map((day) => (
                    <th
                      key={day}
                      className="border px-2 py-2 font-bold bg-gray-100 capitalize"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MEALS.map((meal) => (
                  <tr key={meal.key}>
                    <td className="border font-semibold px-2 py-3 bg-gray-100">
                      {meal.label}
                    </td>
                    {DAYS.map((day) => {
                      const recipe = planning && planning[day] ? planning[day][meal.key] : null;
                      return (
                        <td
                          key={day + meal.key}
                          className="border px-2 py-2 min-w-[120px] align-top"
                        >
                          {recipe ? (
                            <div className="flex flex-col items-center">
                              {recipe.image && (
                                <img
                                  src={recipe.image}
                                  alt={recipe.title}
                                  className="w-24 h-16 object-cover mb-1 rounded-lg"
                                />
                              )}
                              <div
                                className="tooltip"
                                data-tip="Voir la recette"
                              >
                                <button
                                  className="text-sm font-bold text-green-800 text-center mb-1 hover:underline"
                                  onClick={() => {
                                    if ((recipe.id && (recipe.id.toString().startsWith("custom_") || recipe.id.toString().startsWith("ai_"))) || recipe.title === "repas personnalisé") {
                                      const customId = recipe.id || "custom_old";
                                      navigate(`/repas-personnalise/${customId}`, { state: { recipe } });
                                    } else {
                                      navigate(`/recette/${recipe.id}`);
                                    }
                                  }}
                                >
                                  {recipe.title}
                                </button>
                              </div>
                              <button
                                onClick={() =>
                                  handleAskRemove(day, meal.key, recipe.title)
                                }
                                className="text-xs text-red-500 hover:underline"
                              >
                                Supprimer
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center min-h-[70px]">
                              <div className="text-gray-500 text-center text-xs italic">
                                Vide
                              </div>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
