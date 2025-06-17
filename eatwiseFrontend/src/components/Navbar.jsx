import {
  User,
  Utensils,
  LogOut,
  UtensilsCrossed,
  Calendar,
  LayoutDashboard,
} from "lucide-react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/useUser";
import { useRef, useState, useEffect } from "react";
import { useScrollDirection } from "../hooks/useScrollDirection";

export default function Navbar() {
  const { user, token, logout } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { isVisible } = useScrollDirection();

  // Ferme le menu si on clique hors du menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  // Récupère la première lettre du prénom
  const avatarLetter =
    user?.first_name?.length > 0 ? user.first_name[0].toUpperCase() : "?";

  const handleLogout = () => {
    setShowLogoutModal(false);
    setMenuOpen(false);
    logout && logout();
    navigate("/login");
  };

  // Menu utilisateur à droite
  const userMenu = (
    <div className="relative flex items-center" ref={menuRef}>
      <button
        onClick={() => setMenuOpen((o) => !o)}
        className="w-11 h-11 rounded-full bg-green-600 text-white flex items-center justify-center text-xl font-bold shadow-md border-2 border-green-700 hover:scale-105 transition focus:outline-none"
        aria-label="Menu utilisateur"
        tabIndex={0}
      >
        {avatarLetter}
      </button>
      {menuOpen && (
        <div className="absolute right-0 top-12 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-fade-in">
          {/* Partie profil/nom */}
          <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
              {avatarLetter}
            </div>
            <div>
              <div className="font-bold text-gray-900 text-base">
                {user?.first_name} {user?.last_name}
              </div>
              <div className="text-gray-500 text-sm">{user?.email}</div>
            </div>
          </div>
          {/* Menu liens */}
          <ul className="py-2">
            <li>
              <Link
                to="/dashboard"
                className="flex items-center gap-3 px-5 py-3 text-gray-800 hover:bg-gray-100 rounded-xl transition"
                onClick={() => setMenuOpen(false)}
              >
                <LayoutDashboard size={20} />
                Tableau de bord
              </Link>
            </li>
            <li>
              <Link
                to="/user-recipes"
                className="flex items-center gap-3 px-5 py-3 text-gray-800 hover:bg-gray-100 rounded-xl transition"
                onClick={() => setMenuOpen(false)}
              >
                <UtensilsCrossed size={20} />
                Plats compatibles
              </Link>
            </li>
            <li>
              <Link
                to="/planning"
                className="flex items-center gap-3 px-5 py-3 text-gray-800 hover:bg-gray-100 rounded-xl transition"
                onClick={() => setMenuOpen(false)}
              >
                <Calendar size={20} />
                Planning
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="flex items-center gap-3 px-5 py-3 text-gray-800 hover:bg-gray-100 rounded-xl transition"
                onClick={() => setMenuOpen(false)}
              >
                <User size={20} />
                Profil
              </Link>
            </li>
          </ul>
          <div className="border-t border-gray-200 pt-2 pb-1 px-5">
            <button
              onClick={() => {
                setMenuOpen(false);
                setShowLogoutModal(true);
              }}
              className="w-full text-left flex items-center gap-3 text-red-600 font-semibold px-2 py-2 rounded-xl hover:bg-red-50 transition"
            >
              <LogOut size={20} />
              Se déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full bg-white shadow-md py-3 px-4 md:px-14 z-50 transition-transform duration-300 ${
          !isVisible ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo et menu mobile */}
          <div className="flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="flex items-center ml-2 md:ml-0">
              <Utensils className="text-gray-800" />
              <span className="font-bold text-2xl text-gray-800 ml-2">
                EatWise
              </span>
            </div>
          </div>

          {/* Menu desktop */}
          <div className=" hidden md:flex items-center space-x-10">
            <Link
              to="/"
              className="text-gray-700 font-semibold text-lg hover:text-green-600 transition-colors"
            >
              Accueil
            </Link>
            <Link
              to="/diets"
              className="text-gray-700 font-semibold text-lg hover:text-green-600 transition-colors"
            >
              Régimes
            </Link>
            <Link
              to="/about"
              className="text-gray-700 font-semibold text-lg hover:text-green-600 transition-colors"
            >
              À propos
            </Link>
          </div>

          {/* Bouton connexion ou menu utilisateur */}
          <div>
            {!token ? (
              <Link
                to="/login"
                className="btn inline-flex items-center px-4 pb-[3px] text-white text-lg rounded-xl bg-green-600 hover:bg-green-700"
              >
                Se connecter
              </Link>
            ) : (
              userMenu
            )}
          </div>
        </div>

        {/* Menu mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 font-semibold text-lg hover:text-green-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link
                to="/diets"
                className="text-gray-700 font-semibold text-lg hover:text-green-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Régimes
              </Link>
              <Link
                to="/about"
                className="text-gray-700 font-semibold text-lg hover:text-green-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                À propos
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Modal de confirmation de déconnexion */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Confirmer la déconnexion
            </h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous
              reconnecter pour accéder à votre compte.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}

      <Outlet />
    </>
  );
}
