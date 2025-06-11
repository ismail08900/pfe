import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Cake,
  Ruler,
  Weight,
  ChevronDown,
  AlertTriangle,
  Salad,
  Dumbbell,
  Target,
  VenusAndMars,
  Flame,
  ArrowLeftCircle,
  ChevronUp,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Checkbox from "../components/Ckeckbox";
import api from "../api";

export default function Register() {
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [customDiet, setCustomDiet] = useState(false);
  const [customAllergy, setCustomAllergy] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedSelect, setFocusedSelect] = useState(null);
  //backend api data
  const [diets, setDiets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [allergyList, setAllergyList] = useState([]);
  //

  useEffect(() => {
    api.get("/diets-type").then((res) => setDiets(res.data));
    api.get("/goals").then((res) => setGoals(res.data));
    api.get("/activities-level").then((res) => setActivities(res.data));
    api.get("/allergies").then((res) => setAllergyList(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "password") {
      let strength = "";
      if (!value) {
        strength = "";
      } else if (value.length < 8) {
        strength = "faible";
      } else if (
        /[A-Z]/.test(value) &&
        /[0-9]/.test(value) &&
        /[a-z]/.test(value)
      ) {
        strength = "fort";
      } else {
        strength = "moyen";
      }
      setPasswordStrength(strength);
    }

    if (name === "diet_type_id") setCustomDiet(value === "other");
    if (name === "autre_allergie") setCustomAllergy(checked);

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const inputClass =
    "w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 placeholder:text-gray-400 bg-white text-base";
  const selectClass =
    "w-full pl-10 pr-10 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 appearance-none placeholder:text-gray-400 bg-white text-base";

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
          Créez un nouveau compte
        </h2>
        <p className="mt-2 text-sm ">
          Ou{" "}
          <Link
            to="/login"
            className="font-medium text-green-600 hover:text-green-600/80"
          >
            connectez-vous à votre compte
          </Link>
        </p>
      </div>
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-10 border-y-4 border-green-600">
        <h2 className="text-2xl font-bold text-center">Inscription</h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Entrez vos informations pour créer votre compte
        </p>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            if (formData.password !== formData.password_confirmation) {
              setPasswordConfirmError(
                "Les mots de passe ne correspondent pas."
              );
              const confirmInput = event.target.querySelector(
                'input[name="password_confirmation"]'
              );
              if (confirmInput) {
                setTimeout(() => {
                  confirmInput.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                  confirmInput.focus();
                }, 0);
              }
              return;
            } else {
              setPasswordConfirmError("");
            }
            setLoading(true);
            // Récupère les allergies cochées
            const allergy_ids = allergyList
              .filter((a) => formData[a.name])
              .map((a) => a.id);

            try {
              const res = await api.post("/register", {
                ...formData,
                diet_type_id: formData.diet_type_id,
                goal_id: formData.goal_id,
                activity_level_id: formData.activity_level_id,
                allergy_ids,
              });
              setError("");
              localStorage.setItem("verifyToken", res.data.token);
              navigate("/verify-email");
            } catch (err) {
              // Ici, ne pas essayer de lire res.data, utilise err.response.data ou un message par défaut
              setError(
                err.response?.data?.message ||
                  "Erreur lors de l'inscription. Veuillez vérifier vos informations."
              );
            } finally {
              setLoading(false);
            }
          }}
        >
          {/* Nom */}
          <div className="mb-4">
            <label className="label text-sm font-medium mb-1">Nom</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <User size={18} />
              </span>

              <input
                name="last_name"
                type="text"
                placeholder="Votre nom"
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
          </div>
          {/* Prenom */}
          <div className="mb-4">
            <label className="label text-sm font-medium mb-1">Prénom</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <User size={18} />
              </span>
              <input
                name="first_name"
                type="text"
                placeholder="Votre prénom"
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
          </div>{" "}
          {/* Téléphone */}
          <div className="mb-4">
            <label className="label text-sm font-medium mb-1">Téléphone</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <Phone size={18} />
              </span>
              <input
                name="phone"
                type="tel"
                placeholder="(optionnel)"
                pattern="^(\+212|0)([5-7][0-9]{8})$"
                title="Le numéro doit commencer par +212 ou 0 suivi de 9 chiffres (ex: 06XXXXXXXX ou +2126XXXXXXXX)."
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>
          {/* Email */}
          <div className="mb-4">
            <label className="label text-sm font-medium mb-1">Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <Mail size={18} />
              </span>
              <input
                name="email"
                type="email"
                placeholder="vous@exemple.com"
                onChange={handleChange}
                className={inputClass}
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
                name="password"
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$"
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                onChange={handleChange}
                className={`${inputClass} pr-10`}
                title="Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial."
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
            {passwordStrength && (
              <div
                className={`mt-1 text-xs ${
                  passwordStrength === "fort"
                    ? "text-green-600"
                    : passwordStrength === "moyen"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                Force du mot de passe : {passwordStrength}
              </div>
            )}
          </div>
          {/* Confirmation mot de passe */}
          <div className="mb-4">
            <label className="label text-sm font-medium mb-1">
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <Lock size={18} />
              </span>
              <input
                name="password_confirmation"
                type={showPassword ? "text" : "password"}
                placeholder="Confirmer le mot de passe"
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
            {passwordConfirmError && (
              <div className="mt-1 text-sm text-red-600">
                {passwordConfirmError}
              </div>
            )}
          </div>
          {/* Date naissance */}
          <div className="mb-4">
            <label className="label text-sm font-medium mb-1">
              Date de naissance
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <Cake size={18} />
              </span>
              <input
                name="birth_date"
                type="date"
                max={new Date().toISOString().split("T")[0]}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
          </div>
          {/* Sexe */}
          <div className="mb-4">
            <label className="label text-sm font-medium mb-1">Sexe</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <VenusAndMars size={18} />
              </span>
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 pointer-events-none">
                {focusedSelect === "gender" ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </span>
              <select
                name="gender"
                onFocus={() => setFocusedSelect("gender")}
                onBlur={() => setFocusedSelect(null)}
                onChange={handleChange}
                className={`${selectClass}`}
                required
                defaultValue=""
              >
                <option value="" disabled>
                  Sexe
                </option>
                <option value="male">Homme</option>
                <option value="female">Femme</option>
                <option value="na">Préfère ne pas dire</option>
              </select>
            </div>
          </div>
          {/* Taille */}
          <div className="mb-4">
            <label className="label text-sm font-medium mb-1">
              Taille (cm)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <Ruler size={18} />
              </span>
              <input
                name="height"
                type="number"
                placeholder="Votre taille en cm"
                min={90}
                max={250}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
          </div>
          {/* Poids */}
          <div className="mb-4">
            <label className="label text-sm font-medium mb-1">Poids (kg)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <Weight size={18} />
              </span>
              <input
                name="weight"
                type="number"
                placeholder="Votre poids en kg"
                min={30}
                max={300}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
          </div>
          {/* Activité */}
          <div className="mb-4">
            <label className="label text-sm font-medium mb-1">
              Niveau d'activité
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <Dumbbell size={18} />
              </span>
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 pointer-events-none">
                {focusedSelect === "activity" ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </span>
              <select
                name="activity_level_id"
                onFocus={() => setFocusedSelect("activity")}
                onBlur={() => setFocusedSelect(null)}
                onChange={handleChange}
                className={selectClass}
                required
                defaultValue=""
              >
                <option value="" disabled>
                  Niveau d'activité
                </option>
                {activities.map((activity) => (
                  <option value={activity.id} key={activity.id}>
                    {activity.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Objectif nutritionnel */}
          <div className="mb-4">
            <label className="label text-sm font-medium mb-1">
              Objectif nutritionnel
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <Target size={18} />
              </span>
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 pointer-events-none">
                {focusedSelect === "goal" ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </span>
              <select
                name="goal_id"
                onFocus={() => setFocusedSelect("goal")}
                onBlur={() => setFocusedSelect(null)}
                onChange={handleChange}
                className={selectClass}
                required
                defaultValue=""
              >
                <option value="" disabled>
                  Objectif nutritionnel
                </option>
                {goals.map((goal) => (
                  <option value={goal.id} key={goal.id}>
                    {goal.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Objectif calorique */}
          <div className="mb-4">
            <label className="label text-sm font-medium mb-1">
              Objectif calorique (optionnel)
            </label>
            <div className="relative">
              {" "}
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <Flame size={18} />
              </span>
              <input
                name="calorie_target"
                type="number"
                placeholder="Exemple : 2200"
                min={1000}
                max={6000}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>
          {/* Régime alimentaire */}
          <div className="mb-4">
            <label className="label text-sm font-medium mb-1">
              Régime alimentaire
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <Salad size={18} />
              </span>
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 pointer-events-none">
                {focusedSelect === "diet" ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </span>
              <select
                name="diet_type_id"
                onFocus={() => setFocusedSelect("diet")}
                onBlur={() => setFocusedSelect(null)}
                onChange={handleChange}
                className={selectClass}
                required
                value={formData.diet_type_id || ""}
              >
                <option value="" disabled>
                  Sélectionnez un régime
                </option>
                <option value="none">none</option>
                {diets.map((diet) => (
                  <option value={diet.id} key={diet.id}>
                    {diet.name}
                  </option>
                ))}
                <option value="other">other</option>
              </select>
            </div>
            {/* Input custom diet */}
            {customDiet && (
              <div className="relative mt-4">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <Salad size={18} />
                </span>
                <input
                  type="text"
                  name="custom_diet"
                  placeholder="Spécifiez votre type de régime"
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
            )}
          </div>
          {/* Allergies */}
          <div className="mb-4">
            <label className="block font-bold text-green-700 mb-2">
              Allergies alimentaires
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {allergyList.map((allergy) => (
                <label
                  key={allergy.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-full border border-green-200 bg-green-50 cursor-pointer transition hover:border-green-600"
                >
                  <Checkbox
                    checked={!!formData[allergy.name]}
                    onChange={handleChange}
                    name={allergy.name}
                  />
                  <span className="capitalize text-sm text-gray-700">
                    {allergy.name.replace(/_/g, " ")}
                  </span>
                </label>
              ))}
              <label className="flex items-center gap-2 px-3 py-2 rounded-full border border-green-600 bg-green-100 cursor-pointer transition hover:border-green-800 font-bold">
                <Checkbox
                  checked={!!formData["autre_allergie"]}
                  onChange={handleChange}
                  name="autre_allergie"
                />
                <AlertTriangle size={16} className="text-green-700" />
                <span>Autre</span>
              </label>
            </div>
            {customAllergy && (
              <input
                type="text"
                name="custom_allergy"
                placeholder="Spécifiez d'autres allergies"
                onChange={handleChange}
                className={inputClass}
                required
              />
            )}
          </div>
          {/* Consentement */}
          <div className="flex flex-col gap-2 mt-2 mb-2">
            <label className="flex items-center gap-2 cursor-pointer text-gray-700 text-sm">
              <Checkbox
                checked={!!formData["terms"]}
                onChange={handleChange}
                name="terms"
                required
              />

              <span>
                J'accepte les{" "}
                <a
                  href="#"
                  className="underline text-green-600 hover:text-green-800 font-semibold"
                >
                  conditions générales d'utilisation
                </a>
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-gray-700 text-sm">
              <Checkbox
                checked={!!formData["newsletter"]}
                onChange={handleChange}
                name="newsletter"
              />

              <span>Je souhaite recevoir des recommandations par e-mail</span>
            </label>
          </div>
          <button
            type="submit"
            className={`btn bg-green-600 hover:bg-[#2E7D32] rounded-xl text-white w-full mt-4 ${
              loading ? "btn-disabled opacity-60 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading && (
              <span className="loading loading-spinner loading-sm mr-2"></span>
            )}
            {loading ? "Création en cours..." : "Créer mon compte"}
          </button>
          {error && (
            <div className="alert alert-error shadow-lg my-4">
              <span>{error}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
