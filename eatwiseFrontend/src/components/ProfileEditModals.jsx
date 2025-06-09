import React, { useState, useEffect } from "react";
import api from "../api";

// Modal d'édition des infos personnelles
export function EditProfileModal({ user, open, onClose, onSaved }) {
  const [first_name, setFirstName] = useState(user?.first_name || "");
  const [last_name, setLastName] = useState(user?.last_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [birth_date, setBirthDate] = useState(user?.birth_date || "");
  const [height, setHeight] = useState(user?.height || "");
  const [weight, setWeight] = useState(user?.weight || "");
  // On conserve aussi le régime et les allergies pour ne pas les effacer
  const [diet_type_id, setDietTypeId] = useState(
    user?.dietType?.id || user?.diet_type_id || ""
  );
  const [allergy_ids, setAllergyIds] = useState(
    Array.isArray(user?.allergies) ? user.allergies.map((a) => a.id) : []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Remet à jour les champs si user change (ex: réouverture du modal)
  useEffect(() => {
    setFirstName(user?.first_name || "");
    setLastName(user?.last_name || "");
    setEmail(user?.email || "");
    setPhone(user?.phone || "");
    setBirthDate(user?.birth_date || "");
    setHeight(user?.height || "");
    setWeight(user?.weight || "");
    setDietTypeId(user?.dietType?.id || user?.diet_type_id || "");
    setAllergyIds(
      Array.isArray(user?.allergies) ? user.allergies.map((a) => a.id) : []
    );
  }, [user, open]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.put("/user/profile", {
        first_name,
        last_name,
        email,
        phone,
        birth_date,
        height,
        weight,
        diet_type_id,
        allergy_ids, // Préserve le régime et les allergies
      });
      onSaved(res.data.user);
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.errors?.email?.[0] ||
          err.response?.data?.errors?.first_name?.[0] ||
          err.response?.data?.errors?.last_name?.[0] ||
          "Erreur."
      );
    }
    setLoading(false);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <form
        className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md"
        onSubmit={handleSave}
      >
        <h2 className="text-xl font-bold mb-4">Modifier mes informations</h2>
        <div className="mb-2">
          <label className="block text-gray-700">Prénom</label>
          <input
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700">Nom</label>
          <input
            value={last_name}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input input-bordered w-full"
            type="email"
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700">Téléphone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700">Date de naissance</label>
          <input
            value={birth_date}
            onChange={(e) => setBirthDate(e.target.value)}
            className="input input-bordered w-full"
            type="date"
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700">Taille (cm)</label>
          <input
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="input input-bordered w-full"
            type="number"
            min={90}
            max={250}
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700">Poids (kg)</label>
          <input
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="input input-bordered w-full"
            type="number"
            min={30}
            max={300}
          />
        </div>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            className="btn bg-green-600 text-white"
            disabled={loading}
          >
            Enregistrer
          </button>
          <button type="button" className="btn" onClick={onClose}>
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
        diet_type_id: dietId === "" ? null : Number(dietId), // Si vide, on envoie null
        allergy_ids: allergyIds,
        // On envoie aussi le reste pour préserver les infos
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        birth_date: user.birth_date,
        height: user.height,
        weight: user.weight,
      });
      onSaved();
      onClose();
    } catch (err) {
      // Optionnel: gestion d'erreur
    }
    setLoading(false);
  };

  if (!open) return null;
  if (!Array.isArray(allDiets) || !Array.isArray(allAllergies)) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
        <div className="bg-white p-4 rounded shadow">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <form
        className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md"
        onSubmit={handleSave}
      >
        <h2 className="text-xl font-bold mb-4">Modifier mes préférences</h2>
        <div className="mb-2">
          <label className="block text-gray-700">Régime</label>
          <select
            className="input input-bordered w-full"
            value={dietId}
            onChange={(e) => setDietId(e.target.value)}
          >
            <option value="">Aucun</option>
            {allDiets.map((d) => (
              <option value={String(d.id)} key={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block text-gray-700">Allergies</label>
          <div className="flex flex-wrap gap-2">
            {allAllergies.map((a) => (
              <label key={a.id} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={allergyIds.includes(a.id)}
                  onChange={() => handleAllergyToggle(a.id)}
                />
                {a.name}
              </label>
            ))}
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            className="btn bg-green-600 text-white"
            disabled={loading}
          >
            Enregistrer
          </button>
          <button type="button" className="btn" onClick={onClose}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
