import React, { useState } from "react";
import { Mail, Lock, ArrowLeftCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/admin/login",
        {
          email,
          password,
        }
      );
      // Stocke le token et les infos admin
      localStorage.setItem("adminToken", response.data.token);
      localStorage.setItem("adminInfo", JSON.stringify(response.data.admin));
      setLoading(false);
      navigate("/admin/dashboard");
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.message ||
          "Erreur lors de la connexion. Veuillez réessayer."
      );
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
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border-y-4 border-green-600">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-2">
          Connexion Admin
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Accédez à l'espace d'administration
        </p>
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="label text-sm font-medium mb-1">Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <Mail size={18} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@exemple.com"
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                required
                autoFocus
                autoComplete="username"
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="label text-sm font-medium mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <Lock size={18} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                required
                autoComplete="current-password"
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn bg-green-600 hover:bg-[#2E7D32] rounded-xl text-white w-full"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
