import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Utensils,
  MapPin,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const AddRestaurantModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    phone: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    // Réinitialiser le formulaire et l'état de modification à chaque ouverture/fermeture
    setFormData({
      name: "",
      location: "",
      phone: "",
      email: "",
      password: "",
      password_confirmation: "",
    });
    setIsModified(false);
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setIsModified(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.password_confirmation) {
      toast.error("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        `${API_BASE}/restaurant/register`,
        formData
      );
      toast.success("Restaurant ajouté avec succès !");
      onSuccess();
      onClose();
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const errors = error.response.data.errors;
        for (const key in errors) {
          toast.error(errors[key][0]);
        }
      } else {
        toast.error("Une erreur est survenue lors de l'ajout du restaurant.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl animate-fade-in"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
          aria-label="Fermer"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
          Ajouter un restaurant
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Nom du restaurant */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Nom du restaurant
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <Utensils size={18} />
              </span>
              <input
                type="text"
                name="name"
                placeholder="Nom du restaurant"
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
            </div>
          </div>
          {/* Localisation */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Localisation
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <MapPin size={18} />
              </span>
              <input
                type="text"
                name="location"
                placeholder="Adresse ou ville"
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
            </div>
          </div>
          {/* Numéro de téléphone */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Numéro de téléphone
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <Phone size={18} />
              </span>
              <input
                type="text"
                name="phone"
                placeholder="06 XX XX XX XX"
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                required
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
                type="email"
                name="email"
                placeholder="resto@email.com"
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
            </div>
          </div>
          {/* Mot de passe */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <Lock size={18} />
              </span>
              <input
                type="password"
                name="password"
                placeholder="Mot de passe (8+ caractères)"
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
            </div>
          </div>
          {/* Confirmation du mot de passe */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Confirmation du mot de passe
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <Lock size={18} />
              </span>
              <input
                type="password"
                name="password_confirmation"
                placeholder="Confirmez le mot de passe"
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-gray-100 text-gray-800 font-semibold hover:bg-gray-200 transition"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={!isModified || loading}
            className="px-6 py-2 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition disabled:bg-gray-400"
          >
            {loading ? "Ajout en cours..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRestaurantModal;
