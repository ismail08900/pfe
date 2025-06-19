import React, { useState } from "react";
import { Mail, Lock, MapPin, Phone, Utensils, Image, Eye, EyeOff, ArrowLeftCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RestaurantRegister = () => {
  const [form, setForm] = useState({
    name: "",
    location: "",
    phone: "",
    email: "",
    password: "",
    password_confirmation: "",
   
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation côté front minimal
    

    const data = new FormData();
    data.append("name", form.name);
    data.append("location", form.location);
    data.append("phone", form.phone);
    data.append("email", form.email);
    data.append("password", form.password);
    data.append("password_confirmation", form.password_confirmation);
   

    try {
      await api.post("/restaurant/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Restaurant inscrit avec succès ! Redirection...");
      setTimeout(() => navigate("/restaurant/login"), 1800);
    } catch (err) {
      if (err.response?.data?.errors) {
        Object.values(err.response.data.errors).forEach((msgArr) =>
          toast.error(msgArr[0])
        );
      } else {
        toast.error(
          err.response?.data?.message ||
            "Erreur lors de l'inscription. Veuillez vérifier les champs."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-16">
      <ToastContainer position="bottom-left" autoClose={4000} theme="colored" />
      <div className="absolute top-6 left-6 z-50">
        <Link
          to="/"
          className="flex items-center gap-2 text-gray-900 hover:text-gray-500 font-semibold"
        >
          <ArrowLeftCircle size={24} />
          Accueil
        </Link>
      </div>
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border-y-4 border-green-600">
        <h2 className="text-2xl font-bold text-center mb-2">
          Inscrire un Restaurant
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Remplissez le formulaire pour inscrire votre restaurant sur EatWise.
        </p>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Nom */}
          <div className="mb-3">
            <label className="label text-sm font-medium mb-1">Nom du restaurant</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <Utensils size={18} />
              </span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nom du restaurant"
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
            </div>
          </div>

          {/* Localisation */}
          <div className="mb-3">
            <label className="label text-sm font-medium mb-1">Localisation</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <MapPin size={18} />
              </span>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Adresse ou ville"
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
            </div>
          </div>

          {/* Téléphone */}
          <div className="mb-3">
            <label className="label text-sm font-medium mb-1">Numéro de téléphone</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <Phone size={18} />
              </span>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="06 XX XX XX XX"
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="label text-sm font-medium mb-1">Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <Mail size={18} />
              </span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="resto@email.com"
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
            </div>
          </div>

          {/* Images */}
         

          {/* Mot de passe */}
          <div className="mb-3">
            <label className="label text-sm font-medium mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Mot de passe"
                className="w-full pl-10 pr-10 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
              <span
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          {/* Confirmation mot de passe */}
          <div className="mb-4">
            <label className="label text-sm font-medium mb-1">
              Confirmation du mot de passe
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <Lock size={18} />
              </span>
              <input
                type={showConfirm ? "text" : "password"}
                name="password_confirmation"
                value={form.password_confirmation}
                onChange={handleChange}
                placeholder="Confirmez le mot de passe"
                className="w-full pl-10 pr-10 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
              <span
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 cursor-pointer"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="btn bg-green-600 hover:bg-[#2E7D32] rounded-xl text-white w-full"
            disabled={loading}
          >
            {loading ? "Inscription..." : "Inscrire le restaurant"}
          </button>
        </form>

        <p className="text-xs text-center text-gray-500 mt-6">
          Vous avez déjà un compte restaurant ?{" "}
          <Link to="/restaurant/login" className="text-green-600 hover:underline">
            Connectez-vous
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RestaurantRegister;