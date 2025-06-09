import React, { useState, useEffect } from "react";
import { useUser } from "../contexts/useUser";
import { User, Mail, ChefHat, Edit, Trash2, LogOut } from "lucide-react";
import api from "../api";
import {
  EditProfileModal,
  EditPreferencesModal,
} from "../components/ProfileEditModals";

export default function Profile() {
  const { user, setUser, logout } = useUser();
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editPrefsOpen, setEditPrefsOpen] = useState(false);

  const [allDiets, setAllDiets] = useState([]);
  const [allAllergies, setAllAllergies] = useState([]);

  // Charge dynamiquement les régimes et allergies depuis l'API
  const fetchOptions = async () => {
    try {
      const [dietsRes, allergiesRes] = await Promise.all([
        api.get("/diets-type"),
        api.get("/allergies"),
      ]);
      setAllDiets(dietsRes.data);
      setAllAllergies(allergiesRes.data);
    } catch (err) {
      setAllDiets([]);
      setAllAllergies([]);
    }
  };

  // Charge le user à chaque modification des préférences
  const fetchUser = async () => {
    try {
      // On utilise /user qui doit retourner dietType et allergies liés !
      const userRes = await api.get("/user");
      setUser(userRes.data);
    } catch (err) {
      // Optionnel: gestion d'erreur
    }
  };

  useEffect(() => {
    fetchOptions();
    fetchUser();
    // eslint-disable-next-line
  }, []);

  // Recharge user et listes après modification des préférences
  const handlePreferencesSaved = async () => {
    await fetchUser();
    await fetchOptions();
  };

  // Recharge user après modification infos
  const handleProfileSaved = async (updatedUser) => {
    // Si la modale retourne le user à jour
    if (updatedUser) {
      setUser(updatedUser);
    } else {
      await fetchUser();
    }
  };

  // Nom du régime : relation ou fallback par id
  const dietName =
    user?.dietType?.name ||
    allDiets.find((d) => d.id === (user?.diet_type_id || user?.dietType?.id))
      ?.name ||
    "Non renseigné";

  // Allergies (relation ou vide)
  const allergies =
    Array.isArray(user?.allergies) && user.allergies.length
      ? user.allergies.map((a) => a.name).join(", ")
      : "Aucune";

  // Exemple statique pour les stats (à remplacer par vraies valeurs si tu as)
  const platsCompatibles = 42;
  const lastLogin = user?.last_login ?? "27/05/2025";
  const registered = user?.created_at ?? "11/01/2024";

  return (
    <div className="bg-gray-50 pt-1"> 
      <div className="max-w-2xl mx-auto mt-24 bg-white rounded-2xl shadow-lg p-8">
        {/* Avatar + nom */}
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-green-200 flex items-center justify-center text-4xl font-bold text-green-700 shadow">
            {user?.first_name?.[0]?.toUpperCase() || <User size={40} />}
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">
              {user?.first_name} {user?.last_name}
            </div>
            <div className="flex items-center text-gray-500 mt-1 gap-2">
              <Mail size={16} />
              {user?.email}
            </div>
          </div>
          <button
            className="ml-auto bg-green-100 hover:bg-green-200 text-green-800 font-semibold px-4 py-2 rounded-xl flex items-center gap-2 transition"
            title="Modifier mes infos"
            onClick={() => setEditProfileOpen(true)}
          >
            <Edit size={18} /> Modifier mes infos
          </button>
        </div>

        {/* Préférences */}
        <div className="mb-8">
          <div className="font-semibold text-lg mb-2 flex items-center gap-2">
            <ChefHat size={20} /> Préférences alimentaires
          </div>
          <div className="flex flex-wrap gap-3 pl-2">
            <span className="bg-gray-100 rounded-lg px-3 py-1 text-gray-800">
              Régime : {dietName}
            </span>
            <span className="bg-gray-100 rounded-lg px-3 py-1 text-gray-800">
              Allergies : {allergies}
            </span>
          </div>
          <button
            className="mt-2 bg-green-50 hover:bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-lg flex items-center gap-1 transition"
            title="Modifier préférences"
            onClick={() => setEditPrefsOpen(true)}
          >
            <Edit size={16} /> Modifier préférences
          </button>
        </div>

        {/* Statistiques */}
        <div className="mb-8">
          <div className="font-semibold text-lg mb-2 flex items-center gap-2">
            Statistiques
          </div>
          <div className="flex gap-6 pl-2">
            <div>
              <div className="text-xl font-bold text-green-700">
                {platsCompatibles}
              </div>
              <div className="text-gray-500 text-sm">Plats compatibles</div>
            </div>
            <div>
              <div className="text-md font-semibold text-gray-800">
                {lastLogin}
              </div>
              <div className="text-gray-500 text-sm">Dernière connexion</div>
            </div>
            <div>
              <div className="text-md font-semibold text-gray-800">
                {registered}
              </div>
              <div className="text-gray-500 text-sm">Inscrit depuis</div>
            </div>
          </div>
        </div>

        {/* Sécurité */}
        <div className="mb-8">
          <div className="font-semibold text-lg mb-2 flex items-center gap-2">
            Sécurité
          </div>
          <button
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition"
            title="Changer mon mot de passe"
            // Ajoute ici une action ou modal pour changer le mot de passe
          >
            <LogOut size={16} /> Changer mon mot de passe
          </button>
        </div>

        {/* Danger zone */}
        <div className="pt-4 border-t border-gray-200">
          <button
            className="bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition"
            title="Supprimer mon compte"
            // Ajoute ici une action ou modal pour la suppression
          >
            <Trash2 size={16} /> Supprimer mon compte
          </button>
        </div>

        {/* Modals */}
        <EditProfileModal
          user={user}
          open={editProfileOpen}
          onClose={() => setEditProfileOpen(false)}
          onSaved={handleProfileSaved}
        />
        <EditPreferencesModal
          user={user}
          open={editPrefsOpen}
          onClose={() => setEditPrefsOpen(false)}
          onSaved={handlePreferencesSaved}
          allDiets={allDiets}
          allAllergies={allAllergies}
        />
      </div>
    </div>
  );
}
