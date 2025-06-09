import { User, CookingPot, Utensils, LogOut } from "lucide-react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/useUser";
import { useRef, useState, useEffect } from "react";
import "/src/App.css";

export default function Navbar() {
  const { user, token, logout } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

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
        <div
          className="absolute right-0 top-12 mt-2
          w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50
          animate-fade-in"
          style={{ minWidth: "260px" }}
        >
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
                to="/home"
                className="flex items-center gap-3 px-5 py-3 text-gray-800 hover:bg-gray-100 rounded-xl transition"
                onClick={() => setMenuOpen(false)}
              >
                <User size={20} />
                Mon espace
              </Link>
            </li>
            <li>
              <Link
                to="/user-recipes"
                className="flex items-center gap-3 px-5 py-3 text-gray-800 hover:bg-gray-100 rounded-xl transition"
                onClick={() => setMenuOpen(false)}
              >
                <Utensils size={20} />
                Plats compatibles
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
                logout && logout();
                navigate("/login");
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
      <div className="navbar bg-base-100 shadow-md py-3 px-14 fixed z-50 top-0 left-0 w-full">
        <div className="navbar-start">
          {/* ... menu burger mobile identique ... */}
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/">Accueil</Link>
              </li>
              <li>
                <Link to="/about">À propos</Link>
              </li>
              <li>
                <Link to="/learnmore">Contacts</Link>
              </li>
            </ul>
          </div>
          <CookingPot className="mr-2" />
          <p className="font-bold text-2xl text-gray-800 -mb-1">EatWise</p>
        </div>
        <div className="navbar-center hidden md:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link
                to="/"
                className="text-gray-700 font-semibold text-lg bg-inherit btn btn-active border-none hover:text-green-600"
              >
                Accueil
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-gray-700 font-semibold text-lg bg-inherit btn btn-active border-none hover:text-green-600"
              >
                À propos
              </Link>
            </li>
            <li>
              <Link
                to="/learnmore"
                className="text-gray-700 font-semibold text-lg bg-inherit btn btn-active border-none hover:text-green-600"
              >
                Contacts
              </Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          {!token ? (
            <Link
              to="/login"
              className="btn text-white text-lg rounded-xl bg-green-600 hover:bg-[#2E7D32] pb-1"
            >
              Se connecter
            </Link>
          ) : (
            userMenu
          )}
        </div>
      </div>
      <Outlet />
    </>
  );
}