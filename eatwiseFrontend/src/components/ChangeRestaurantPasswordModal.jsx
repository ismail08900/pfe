import React, { useState, useEffect } from "react";
import api from "../pages/apiRestaurant";
import { toast } from "react-toastify";

const ChangeRestaurantPasswordModal = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const initialValues = React.useRef({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // Réinitialiser les champs à chaque ouverture
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }, [isOpen]);

  const isModified =
    currentPassword !== initialValues.current.currentPassword ||
    newPassword !== initialValues.current.newPassword ||
    confirmPassword !== initialValues.current.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Tous les champs sont requis.");
      setLoading(false);
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Le nouveau mot de passe doit faire au moins 8 caractères.");
      setLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Les nouveaux mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    try {
      await api.post("/restaurant/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });

      toast.success("Mot de passe modifié avec succès !");
      onClose();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Une erreur est survenue lors de la modification.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Fermer"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Changer le mot de passe
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Mot de passe actuel
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full pl-4 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Entrez votre mot de passe actuel"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full pl-4 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Entrez votre nouveau mot de passe"
              required
            />
          </div>

          <div>
            <label className="block text-gray-900 font-semibold mb-1">
              Confirmer le nouveau mot de passe
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-4 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Confirmez votre nouveau mot de passe"
              required
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4 pt-4 justify-center">
            <button
              type="button"
              className="w-full md:w-auto btn bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl px-8 py-3 shadow-sm transition-all"
              onClick={onClose}
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className={`w-full md:w-auto btn font-bold rounded-xl px-8 py-3 shadow-sm transition-all ${
                isModified && !loading
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!isModified || loading}
            >
              {loading ? "Modification..." : "Confirmer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangeRestaurantPasswordModal;
