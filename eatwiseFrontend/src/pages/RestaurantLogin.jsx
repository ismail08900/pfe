import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowLeftCircle, Utensils } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Checkbox from "../components/Ckeckbox";

const RestaurantLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
    const [check, setCheck] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/restaurant/login", form);
      // Stocke le token et infos restaurant si besoin
      localStorage.setItem("restaurantToken", res.data.token);
      localStorage.setItem("restaurantInfo", JSON.stringify(res.data.restaurant));
      toast.success("Connexion réussie !");
      setTimeout(() => navigate("/restaurant/dashboard"), 1000); // Redirige vers dashboard restaurant (à adapter)
    } catch (err) {
      if (err.response?.data?.errors) {
        Object.values(err.response.data.errors).forEach((msgArr) =>
          toast.error(msgArr[0])
        );
      } else {
        toast.error(
          err.response?.data?.message ||
            "Erreur lors de la connexion. Vérifiez vos identifiants."
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
        <h2 className="text-2xl font-bold text-center mb-2 flex items-center justify-center gap-2">
          Connexion Restaurant
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Connectez-vous pour accéder à votre espace restaurant sur EatWise.
        </p>
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
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

          {/* Mot de passe */}
          <div className="mb-6">
            <label className="label text-sm font-medium mb-1">Mot de passe</label>
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
<div className="flex justify-between items-center mb-4">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={check}
                onChange={(e) => setCheck(e.target.checked)}
              />
              Se souvenir de moi
            </label>
            <a href="#" className="text-green-600 text-sm hover:underline">
              Mot de passe oublié ?
            </a>
          </div>
          {/* Connexion Button */}
          <button
            type="submit"
            className="btn bg-green-600 hover:bg-[#2E7D32] rounded-xl text-white w-full"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="text-xs text-center text-gray-500 mt-6">
          Vous n'avez pas encore de compte restaurant ?{" "}
          <Link to="/restaurant/register" className="text-green-600 hover:underline">
            Inscrivez-vous
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RestaurantLogin;