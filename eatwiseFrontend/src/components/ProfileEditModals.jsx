import React, { useState, useEffect } from "react";
import api from "../api";
import {
  User,
  Mail,
  Phone,
  Cake,
  Ruler,
  Weight,
  Target,
  Salad,
} from "lucide-react";
import {
  dietLabels,
  allergyLabels,
  goalLabels,
  activityLevelLabels,
} from "../utils/labels";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Modal d'édition des infos personnelles
export function EditProfileModal({ user, open, onClose, onSaved }) {
  const [first_name, setFirstName] = useState(user?.first_name || "");
  const [last_name, setLastName] = useState(user?.last_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [height, setHeight] = useState(user?.height || "");
  const [weight, setWeight] = useState(user?.weight || "");
  const [weight_target, setWeightTarget] = useState(user?.weight_target || "");
  // On conserve aussi le régime et les allergies pour ne pas les effacer
  const [diet_type_id, setDietTypeId] = useState(
    user?.dietType?.id || user?.diet_type_id || ""
  );
  const [allergy_ids, setAllergyIds] = useState(
    Array.isArray(user?.allergies) ? user.allergies.map((a) => a.id) : []
  );
  const [activity_level_id, setActivityLevelId] = useState(
    user?.activity_level_id || ""
  );
  const [goal_id, setGoalId] = useState(user?.goal_id || "");
  const [activities, setActivities] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Valeurs initiales pour la détection de modification
  const initialValues = React.useRef({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    height: user?.height || "",
    weight: user?.weight || "",
    weight_target: user?.weight_target || "",
    diet_type_id: user?.dietType?.id || user?.diet_type_id || "",
    allergy_ids: Array.isArray(user?.allergies)
      ? user.allergies.map((a) => a.id)
      : [],
    activity_level_id: user?.activity_level_id || "",
    goal_id: user?.goal_id || "",
  });

  useEffect(() => {
    setFirstName(user?.first_name || "");
    setLastName(user?.last_name || "");
    setEmail(user?.email || "");
    setHeight(user?.height || "");
    setWeight(user?.weight || "");
    setWeightTarget(user?.weight_target || "");
    setDietTypeId(user?.dietType?.id || user?.diet_type_id || "");
    setAllergyIds(
      Array.isArray(user?.allergies) ? user.allergies.map((a) => a.id) : []
    );
    setActivityLevelId(user?.activity_level_id || "");
    setGoalId(user?.goal_id || "");
  }, [user, open]);

  useEffect(() => {
    initialValues.current = {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
      height: user?.height || "",
      weight: user?.weight || "",
      weight_target: user?.weight_target || "",
      diet_type_id: user?.dietType?.id || user?.diet_type_id || "",
      allergy_ids: Array.isArray(user?.allergies)
        ? user.allergies.map((a) => a.id)
        : [],
      activity_level_id: user?.activity_level_id || "",
      goal_id: user?.goal_id || "",
    };
  }, [user, open]);

  useEffect(() => {
    // Charge les options d'activité et d'objectif nutritionnel
    api.get("/activities-level").then((res) => setActivities(res.data));
    api.get("/goals").then((res) => setGoals(res.data));
  }, []);

  function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    return a.every((v) => b.includes(v));
  }
  const isModified =
    first_name !== initialValues.current.first_name ||
    last_name !== initialValues.current.last_name ||
    email !== initialValues.current.email ||
    height !== initialValues.current.height ||
    weight !== initialValues.current.weight ||
    weight_target !== initialValues.current.weight_target ||
    diet_type_id !== initialValues.current.diet_type_id ||
    !arraysEqual(allergy_ids, initialValues.current.allergy_ids) ||
    activity_level_id !== initialValues.current.activity_level_id ||
    goal_id !== initialValues.current.goal_id;

  if (!open) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.put("/user/profile", {
        first_name,
        last_name,
        email,
        height,
        weight,
        weight_target,
        diet_type_id,
        allergy_ids,
        activity_level_id: activity_level_id || null,
        goal_id: goal_id || null,
      });
      onSaved(res.data.user);
      toast.success("Modifications enregistrées !");
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.errors?.email?.[0] ||
          err.response?.data?.errors?.first_name?.[0] ||
          err.response?.data?.errors?.last_name?.[0] ||
          err.response?.data?.errors?.weight_target?.[0] ||
          err.response?.data?.errors?.activity_level_id?.[0] ||
          err.response?.data?.errors?.goal_id?.[0] ||
          "Erreur."
      );
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <form
        className="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl animate-fade-in"
        onSubmit={handleSave}
      >
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Fermer"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
          Modifier mes informations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Prénom */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Prénom
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <User size={18} />
              </span>
              <input
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 text-lg"
                placeholder="Votre prénom"
              />
            </div>
          </div>
          {/* Nom */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Nom
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <User size={18} />
              </span>
              <input
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 text-lg"
                placeholder="Votre nom"
              />
            </div>
          </div>
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <Mail size={18} />
              </span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 text-lg"
                type="email"
                placeholder="vous@exemple.com"
              />
            </div>
          </div>
          {/* Taille */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Taille (cm)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <Ruler size={18} />
              </span>
              <input
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 text-lg"
                type="number"
                min={90}
                max={250}
                placeholder="Votre taille en cm"
              />
            </div>
          </div>
          {/* Poids */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Poids (kg)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <Weight size={18} />
              </span>
              <input
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 text-lg"
                type="number"
                min={30}
                max={300}
                placeholder="Votre poids en kg"
              />
            </div>
          </div>
          {/* Objectif de poids */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Objectif de poids (kg)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <Target size={18} />
              </span>
              <input
                value={weight_target}
                onChange={(e) => setWeightTarget(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 text-lg"
                type="number"
                min={30}
                max={300}
                placeholder="Votre objectif poids en kg"
              />
            </div>
          </div>
          {/* Niveau d'activité */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Niveau d'activité
            </label>
            <div className="relative">
              <select
                value={activity_level_id}
                onChange={(e) => setActivityLevelId(e.target.value)}
                className="w-full pl-3 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 text-lg"
              >
                <option value="">Sélectionner</option>
                {activities.map((a) => (
                  <option key={a.id} value={a.id}>
                    {activityLevelLabels[a.name] || a.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Objectif nutritionnel */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Objectif nutritionnel
            </label>
            <div className="relative">
              <select
                value={goal_id}
                onChange={(e) => setGoalId(e.target.value)}
                className="w-full pl-3 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 text-lg"
              >
                <option value="">Sélectionner</option>
                {goals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {goalLabels[g.name] || g.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {error && (
          <div className="text-red-600 mt-4 text-center font-semibold">
            {error}
          </div>
        )}
        <div className="flex flex-col md:flex-row gap-4 mt-8 justify-center">
          <button
            type="submit"
            className={`w-full md:w-auto btn text-lg font-bold rounded-xl px-8 py-3 shadow ${
              isModified
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-300 text-gray-400 cursor-not-allowed"
            }`}
            disabled={loading || !isModified}
          >
            Enregistrer
          </button>
          <button
            type="button"
            className="w-full md:w-auto btn bg-gray-200 hover:bg-gray-300 text-gray-700 text-lg font-bold rounded-xl px-8 py-3 shadow"
            onClick={onClose}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}

// Modal d'édition des préférences alimentaires (prend toujours les vrais IDs)
export function EditPreferencesModal({
  user,
  open,
  onClose,
  onSaved,
  allDiets,
  allAllergies,
}) {
  const [dietId, setDietId] = useState(
    user?.dietType?.id
      ? String(user.dietType.id)
      : user?.diet_type_id
      ? String(user.diet_type_id)
      : ""
  );
  const [allergyIds, setAllergyIds] = useState(
    Array.isArray(user?.allergies) ? user.allergies.map((a) => a.id) : []
  );
  const [loading, setLoading] = useState(false);

  // Ajout : valeurs initiales pour la détection de modification
  const initialValues = React.useRef({
    dietId: user?.dietType?.id
      ? String(user.dietType.id)
      : user?.diet_type_id
      ? String(user.diet_type_id)
      : "",
    allergyIds: Array.isArray(user?.allergies)
      ? user.allergies.map((a) => a.id)
      : [],
  });

  useEffect(() => {
    setDietId(
      user?.dietType?.id
        ? String(user.dietType.id)
        : user?.diet_type_id
        ? String(user.diet_type_id)
        : ""
    );
    setAllergyIds(
      Array.isArray(user?.allergies) ? user.allergies.map((a) => a.id) : []
    );
  }, [user, open]);

  useEffect(() => {
    initialValues.current = {
      dietId: user?.dietType?.id
        ? String(user.dietType.id)
        : user?.diet_type_id
        ? String(user.diet_type_id)
        : "",
      allergyIds: Array.isArray(user?.allergies)
        ? user.allergies.map((a) => a.id)
        : [],
    };
  }, [user, open]);

  function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    return a.every((v) => b.includes(v));
  }
  const isModified =
    dietId !== initialValues.current.dietId ||
    !arraysEqual(allergyIds, initialValues.current.allergyIds);

  const handleAllergyToggle = (id) => {
    setAllergyIds((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put("/user/profile", {
        diet_type_id: dietId === "" ? null : Number(dietId),
        allergy_ids: allergyIds,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        height: user.height,
        weight: user.weight,
        weight_target: user.weight_target,
        goal_id: user.goal_id,
        activity_level_id: user.activity_level_id,
      });
      onSaved();
      toast.success("Modifications enregistrées !");
      onClose();
    } catch (e) {
      console.log(e);
      // Optionnel: gestion d'erreur
    }
    setLoading(false);
  };

  if (!open) return null;
  if (!Array.isArray(allDiets) || !Array.isArray(allAllergies)) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div className="bg-white p-4 rounded shadow">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <form
        className="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl animate-fade-in"
        onSubmit={handleSave}
      >
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Fermer"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
          Modifier mes préférences
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Régime */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Régime
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <Salad size={18} />
              </span>
              <select
                className="w-full pl-10 pr-10 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 appearance-none text-base"
                value={dietId}
                onChange={(e) => setDietId(e.target.value)}
              >
                <option value="">Aucun</option>
                {allDiets.map((d) => (
                  <option value={String(d.id)} key={d.id}>
                    {dietLabels[d.name] || d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Allergies */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-semibold mb-1">
              Allergies
            </label>
            <div className="flex flex-wrap gap-2">
              {allAllergies.map((a) => (
                <label
                  key={a.id}
                  className="flex items-center gap-1 bg-gray-100 rounded-lg px-3 py-1"
                >
                  <input
                    type="checkbox"
                    checked={allergyIds.includes(a.id)}
                    onChange={() => handleAllergyToggle(a.id)}
                    className="accent-green-600"
                  />
                  {allergyLabels[a.name] || a.name}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mt-8 justify-center">
          <button
            type="submit"
            className={`w-full md:w-auto btn text-lg font-bold rounded-xl px-8 py-3 shadow ${
              isModified
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-300 text-gray-400 cursor-not-allowed"
            }`}
            disabled={loading || !isModified}
          >
            Enregistrer
          </button>
          <button
            type="button"
            className="w-full md:w-auto btn bg-gray-200 hover:bg-gray-300 text-gray-700 text-lg font-bold rounded-xl px-8 py-3 shadow"
            onClick={onClose}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
