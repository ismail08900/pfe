import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowLeftCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useUser } from "../contexts/useUser";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const { setUser, setToken } = useUser();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/login", {
        email: form.email,
        password: form.password,
      });

      // Si l'email n'est pas vérifié, on redirige vers /verify-email
      if (res.data.email_verified === false) {
        // Stocke le token temporaire pour la vérification d'email
        if (res.data.token) {
          localStorage.setItem("verifyToken", res.data.token);
        }
        navigate("/verify-email", { state: { email: form.email } });
        return;
      }

      // Connexion normale
      setToken(res.data.token);
      setUser(res.data.user);
      navigate("/home");
    } catch (err) {
      // Gestion du cas où le backend retourne un 403 (email non vérifié)
      if (
        err.response?.status === 403 &&
        err.response?.data?.email_verified === false
      ) {
        if (err.response.data.token) {
          localStorage.setItem("verifyToken", err.response.data.token);
        }
        navigate("/verify-email", { state: { email: form.email } });
      } else {
        setError(
          err.response?.data?.message ||
            "Erreur lors de la connexion. Vérifiez vos identifiants."
        );
        setIsVisible(true);
        setTimeout(() => {
          setIsVisible(false); // déclenche l'animation
        }, 5000);
        setTimeout(() => {
          setError("");
        }, 6000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-16">
      <div className="absolute top-6 left-6 z-50">
        <Link
          to="/"
          className="flex items-center gap-2 text-gray-900 hover:text-gray-500 font-semibold"
        >
          <ArrowLeftCircle size={24} />
          Accueil
        </Link>
      </div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          Connectez-vous à votre compte
        </h2>
        <p className="mt-2 text-sm ">
          Ou{" "}
          <Link
            to="/register"
            className="font-medium text-green-600 hover:text-green-600/80"
          >
            créez un nouveau compte
          </Link>
        </p>
      </div>
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border-y-4 border-green-600">
        <h2 className="text-2xl font-bold text-center">Connexion</h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Entrez vos identifiants pour accéder à votre compte
        </p>

        {error && (
          <div
            className={`toast toast-start transition-opacity duration-1000 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="alert alert-error ">
              <span>{error}</span>
            </div>
          </div>
        )}

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
                placeholder="vous@exemple.com"
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div className="mb-4">
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
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          {/* Options */}
          <div className="flex justify-between items-center mb-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="checkbox text-green-600" />
              Se souvenir de moi
            </label>
            <a href="#" className="text-green-600 text-sm hover:underline">
              Mot de passe oublié ?
            </a>
          </div>

          {/* Connexion */}
          <button
            type="submit"
            className="btn bg-green-600 hover:bg-[#2E7D32] rounded-xl text-white w-full"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-xs text-center text-gray-500 mt-6">
          En vous connectant, vous acceptez nos{" "}
          <a href="#" className="text-green-600 hover:underline">
            Conditions d'utilisation
          </a>{" "}
          et notre{" "}
          <a href="#" className="text-green-600 hover:underline">
            Politique de confidentialité
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default Login;
