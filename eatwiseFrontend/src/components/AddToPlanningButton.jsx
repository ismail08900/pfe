import React, { useState, useEffect } from "react";
import { PlusCircle, X } from "lucide-react";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Fonction utilitaire copiée de ta page recette
function getNutritionMap(nutrition) {
  const map = {};
  if (!nutrition || !nutrition.nutrients) return map;
  nutrition.nutrients.forEach((n) => {
    const name = n.name.toLowerCase();
    if (name.includes("calories")) map.calories = n.amount;
    if (name === "protein") map.protein = n.amount;
    if (name === "carbohydrates") map.carbs = n.amount;
    if (name === "fat") map.fat = n.amount;
  });
  return map;
}

const DAYS = [
  { key: "lundi", label: "Lundi" },
  { key: "mardi", label: "Mardi" },
  { key: "mercredi", label: "Mercredi" },
  { key: "jeudi", label: "Jeudi" },
  { key: "vendredi", label: "Vendredi" },
  { key: "samedi", label: "Samedi" },
  { key: "dimanche", label: "Dimanche" },
];
const MEALS = [
  { key: "breakfast", label: "Petit-déjeuner" },
  { key: "lunch", label: "Déjeuner" },
  { key: "dinner", label: "Dîner" },
  { key: "snack", label: "Collations" },
];

export default function AddToPlanningButton({ recipe }) {
  const [showModal, setShowModal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [planning, setPlanning] = useState(null);
  const [weekStart, setWeekStart] = useState("");
  const [day, setDay] = useState("lundi");
  const [meal, setMeal] = useState("breakfast");
  const [currentOccupied, setCurrentOccupied] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Récupération des infos nutritionnelles
  const nutrition = getNutritionMap(recipe.nutrition);

  // Ouvre la modal et charge le planning
  const openModal = () => {
    setShowModal(true);
    setDay("lundi");
    setMeal("breakfast");
    setShowConfirm(false);
    api.get("/planning").then((res) => {
      setPlanning(res.data.planning);
      setWeekStart(res.data.week_start);
      setCurrentOccupied(res.data.planning["lundi"]?.["breakfast"] || null);
    });
  };

  // Met à jour la case occupée à chaque changement de sélection
  useEffect(() => {
    if (planning) {
      setCurrentOccupied(planning[day]?.[meal] || null);
      setShowConfirm(false);
    }
  }, [planning, day, meal]);

  // Affiche un toast DaisyUI personnalisé
  function showSuccessToast(msg) {
    const toast = document.createElement("div");
    toast.className = "toast toast-start toast-bottom z-[9999]";
    toast.innerHTML = `
      <div class="alert alert-success">
        <span>${msg}</span>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 2200);
  }

  // Gère l'ajout (ou la confirmation d'écrasement)
  const handleAddClick = () => {
    if (currentOccupied) {
      setShowConfirm(true);
    } else {
      handleSubmit();
    }
  };

  // Ajoute/écrase la recette et ferme la/les modals
  const handleSubmit = () => {
    if (!planning || !weekStart) {
      showSuccessToast("Le planning de la semaine n'est pas encore chargé.");
      return;
    }
    setBusy(true);
    const updatedPlanning = { ...planning };
    updatedPlanning[day] = {
      ...updatedPlanning[day],
      [meal]: {
        id: recipe.id,
        title: recipe.title,
        image: recipe.image || "",
        calories: nutrition.calories || 0,
        protein: nutrition.protein || 0,
        carbs: nutrition.carbs || 0,
        fat: nutrition.fat || 0,
      },
    };
    api
      .post("/planning", {
        week_start: weekStart,
        planning: updatedPlanning,
      })
      .then(() => {
        toast.success("Recette ajoutée au planning !");
        setBusy(false);
        setShowModal(false);
        setShowConfirm(false);
      })
      .catch(() => {
        toast.error("Erreur lors de l'ajout au planning.");
        setBusy(false);
      });
  };

  return (
    <>
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
      <button
        onClick={openModal}
        className="mt-8 w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow transition"
      >
        <PlusCircle size={22} />
        Ajouter au planning
      </button>

      {/* Modal principal */}
      {showModal && !showConfirm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
         
          <div className="bg-white rounded-2xl shadow-lg p-7 w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-800"
              onClick={() => setShowModal(false)}
            >
              <X size={24} />
            </button>
            <h3 className="text-lg font-semibold mb-4 text-green-800">
              Ajouter cette recette au planning
            </h3>
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">
                Jour de la semaine
              </label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                disabled={busy}
              >
                {DAYS.map((d) => (
                  <option key={d.key} value={d.key}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">
                Repas
              </label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={meal}
                onChange={(e) => setMeal(e.target.value)}
                disabled={busy}
              >
                {MEALS.map((m) => (
                  <option key={m.key} value={m.key}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition mt-2"
              onClick={handleAddClick}
              disabled={busy}
            >
              {busy ? "Ajout..." : "Ajouter au planning"}
            </button>
          </div>
        </div>
      )}
      {/* Modal confirmation d'écrasement */}
      {showModal && showConfirm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-lg p-7 w-[380px] relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-800"
              onClick={() => setShowConfirm(false)}
            >
              <X size={24} />
            </button>
            <h3 className="text-lg font-semibold mb-5 text-gray-900">
              La cellule sélectionnée contient déjà :<br />
              <b>{currentOccupied?.title}</b>
            </h3>
            <div className="flex gap-3 mt-2">
              <button
                className="flex-1 bg-gray-200 text-gray-700 font-bold py-2 rounded-lg hover:bg-gray-300"
                onClick={() => setShowConfirm(false)}
                disabled={busy}
              >
                Annuler
              </button>
              <button
                className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-2 rounded-lg"
                onClick={handleSubmit}
                disabled={busy}
              >
                Oui, remplacer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
