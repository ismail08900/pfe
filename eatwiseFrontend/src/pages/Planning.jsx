import { useEffect, useState, useRef } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { HelpCircle } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
            <h3 className="text-lg font-semibold mb-5 text-red-800">
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
            Mon planning de la semaine
          </h2>
          <div className="w-[100px]"></div> {/* Spacer pour centrer le titre */}
        </div>
        <p className="text-center text-gray-500 mb-7">
          Planifiez vos repas pour la semaine ! Pour ajouter une recette,
          utilisez le bouton sur la page de détails de la recette.
        </p>
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
                      const recipe = planning[day][meal.key];
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
                                  onClick={() =>
                                    navigate(`/recette/${recipe.id}`)
                                  }
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
                            <div className="text-gray-500 text-center text-xs italic">
                              Vide
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
