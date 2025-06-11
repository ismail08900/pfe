import React, { useEffect, useState, useRef } from "react";
import { MailCheck, Loader2, RefreshCw, CheckCircle, ArrowLeftCircle } from "lucide-react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function VerifyEmail() {
  const [message, setMessage] = useState("");
  const [verified, setVerified] = useState(false);
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const intervalRef = useRef();
  const navigate = useNavigate();

  // Applique le token temporaire dans les headers
  useEffect(() => {
    const token = localStorage.getItem("verifyToken");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    const checkVerified = async () => {
      try {
        const res = await api.get("/email/is-verified");
        if (res.data.verified) {
          setVerified(true);
          setMessage("Votre email est déjà vérifié. Vous pouvez vous connecter.");
        } else {
          setVerified(false);
        }
      } catch (e) {
        setMessage("Erreur lors de la vérification de l'email.");
      }
    };
    checkVerified();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    intervalRef.current = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [cooldown]);

  const handleResend = async () => {
    setSending(true);
    setMessage("");
    try {
      const res = await api.post("/email/verification-notification");
      setMessage(res.data.message || "Email de vérification renvoyé !");
      setCooldown(30);
    } catch (err) {
      if (err.response?.status === 409) {
        setVerified(true);
        setMessage("Votre email est déjà vérifié. Vous pouvez vous connecter.");
      } else {
        setMessage(err.response?.data?.message || "Erreur lors de l'envoi de l'email.");
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-16">
      {/* Retour Accueil */}
      <div className="absolute top-6 left-6 z-50">
        <Link
          to="/"
          className="flex items-center gap-2 text-gray-900 hover:text-gray-500 font-semibold"
        >
          <ArrowLeftCircle size={24} />
          Accueil
        </Link>
      </div>

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border-y-4 border-green-600 flex flex-col items-center">
        <div className="flex flex-col items-center mb-6">
          {/* Icône principale */}
          {verified ? (
            <CheckCircle className="text-green-600 mb-2" size={46} />
          ) : (
            <MailCheck className="text-green-600 mb-2" size={46} />
          )}

          <h2 className="text-2xl font-bold mb-1 text-gray-900">
            Vérification de l'email
          </h2>
          <p className="text-gray-500 text-center text-base">
            {verified
              ? "Votre email est vérifié. Vous pouvez maintenant vous connecter."
              : "Un email de vérification a été envoyé à votre adresse. Cliquez sur le lien reçu pour activer votre compte."}
          </p>
        </div>

        {/* Message d’information */}
        {message && (
          <div
            className={`w-full py-2 px-4 rounded-lg text-center mb-4 text-sm ${
              verified
                ? "bg-green-50 text-green-700 border border-green-300"
                : message.toLowerCase().includes("erreur")
                ? "bg-red-50 text-red-700 border border-red-300"
                : "bg-yellow-50 text-yellow-700 border border-yellow-300"
            }`}
          >
            {message}
          </div>
        )}

        {/* Bouton renvoyer */}
        <button
          className={`w-full flex items-center justify-center gap-2 btn bg-green-600 hover:bg-[#2E7D32] text-white rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed mb-2`}
          onClick={handleResend}
          disabled={sending || cooldown > 0 || verified}
        >
          {verified ? (
            <>
              <RefreshCw size={18} />
              Déjà vérifié
            </>
          ) : sending ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Envoi en cours...
            </>
          ) : cooldown > 0 ? (
            <>
              <RefreshCw size={18} />
              Renvoyer ({cooldown}s)
            </>
          ) : (
            <>
              <RefreshCw size={18} />
              Renvoyer l'email de vérification
            </>
          )}
        </button>

        {/* Se connecter */}
        {verified && (
          <button
            className="w-full btn bg-green-600 hover:bg-[#2E7D32] text-white rounded-xl mt-4 font-semibold"
            onClick={() => {
              localStorage.removeItem("verifyToken");
              navigate("/login");
            }}
          >
            Se connecter
          </button>
        )}
      </div>
    </div>
  );
}