import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LogOut, Utensils, X, PlusCircle } from "lucide-react";
import AddRestaurantModal from "../components/AddRestaurantModal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = "http://localhost:8000/api/admin";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, restaurants: 0, dishes: 0 });
  const [view, setView] = useState("users"); // "users" or "restaurants"
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // États pour le modal de confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemType, setItemType] = useState(null);

  // État pour le modal de confirmation de déconnexion
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // État pour le modal d'ajout de restaurant
  const [showAddRestaurantModal, setShowAddRestaurantModal] = useState(false);

  // Authentification admin
  useEffect(() => {
    const fetchAdmin = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin/login");
        return;
      }
      try {
        const response = await axios.get(`${API_BASE}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmin(response.data.admin);
      } catch (e) {
        console.log(e);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminInfo");
        navigate("/admin/login");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, [navigate]);

  // Récupérer les stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get(`${API_BASE}/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchStats();
  }, [refresh]);

  // Récupérer la liste users/restaurants
  useEffect(() => {
    const fetchList = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (view === "users") {
          const res = await axios.get(`${API_BASE}/users`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsers(res.data.users || []);
        } else {
          const res = await axios.get(`${API_BASE}/restaurants`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setRestaurants(res.data.restaurants || []);
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchList();
  }, [view, refresh]);

  // Ouvrir le modal de confirmation de déconnexion
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      await axios.post(
        `${API_BASE}/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (e) {
      console.log(e);
    }
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    navigate("/admin/login");
  };

  // Ouvrir le modal de confirmation
  const handleDeleteClick = (item, type) => {
    setItemToDelete(item);
    setItemType(type);
    setShowDeleteModal(true);
  };

  // Suppression user/restaurant
  const handleDelete = async () => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`${API_BASE}/${itemType}/${itemToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRefresh((r) => !r);
      setShowDeleteModal(false);
      setItemToDelete(null);
      setItemType(null);
    } catch (e) {
      console.log(e);
    } finally {
      setActionLoading(false);
    }
  };

  // Recherche filtrée
  const filteredUsers = users.filter(
    (u) =>
      u.first_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.last_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );
  const filteredRestaurants = restaurants.filter(
    (r) =>
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.email?.toLowerCase().includes(search.toLowerCase()) ||
      r.phone?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-gray-600">
          Chargement du tableau de bord...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer
        position="bottom-left"
        autoClose={4000}
        newestOnTop={true}
        closeOnClick={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {/* Nouvelle navbar admin inspirée du design utilisateur */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow-md py-3 px-4 md:px-10 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Utensils className="text-gray-900" />
            <span className="font-bold text-2xl text-gray-900 ml-2 mr-3">
              EatWise
            </span>
            <span className="font-semibold">admin</span>
          </div>
          {/* Liens de navigation */}

          {/* Infos admin et déconnexion */}
          <div className="flex items-center gap-4">
            {admin && (
              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                {admin.email}
              </span>
            )}
            <button
              onClick={handleLogoutClick}
              className="flex ml-4 border text-red-600 border-red-600 px-4 py-2 rounded-xl transition font-semibold"
            >
              <LogOut className="mr-2" />
              Déconnexion
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto py-10 pt-28">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow rounded p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">👤</span>
            <div className="font-semibold mb-1">Utilisateurs</div>
            <div className="text-2xl font-bold text-green-700">
              {stats.users}
            </div>
          </div>
          <div className="bg-white shadow rounded p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">🍽️</span>
            <div className="font-semibold mb-1">Restaurants</div>
            <div className="text-2xl font-bold text-green-700">
              {stats.restaurants}
            </div>
          </div>
          <div className="bg-white shadow rounded p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">🥗</span>
            <div className="font-semibold mb-1">Plats des restaurants</div>
            <div className="text-2xl font-bold text-green-700">
              {stats.dishes}
            </div>
          </div>
        </div>

        {/* Bouton de switch et recherche */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <button
              className={`px-4 py-2 rounded-l ${
                view === "users"
                  ? "bg-green-700 text-white"
                  : "bg-white text-green-700 border"
              }`}
              onClick={() => setView("users")}
            >
              Utilisateurs
            </button>
            <button
              className={`px-4 py-2 rounded-r ${
                view === "restaurants"
                  ? "bg-green-700 text-white"
                  : "bg-white text-green-700 border"
              }`}
              onClick={() => setView("restaurants")}
            >
              Restaurants
            </button>
          </div>
          <div className="flex items-center gap-4">
            {view === "restaurants" && (
              <button
                onClick={() => setShowAddRestaurantModal(true)}
                className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors"
              >
                <PlusCircle size={20} />
                Ajouter
              </button>
            )}
            <input
              type="text"
              placeholder={
                view === "users"
                  ? "Rechercher un utilisateur..."
                  : "Rechercher un restaurant..."
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border rounded-md"
            />
          </div>
        </div>

        {/* Liste utilisateurs/restaurants */}
        {view === "users" ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr className="bg-green-100">
                  <th className="py-2 px-4">Prénom</th>
                  <th className="py-2 px-4">Nom</th>
                  <th className="py-2 px-4">Email</th>
                  <th className="py-2 px-4">Téléphone</th>
                  <th className="py-2 px-4">Date de naissance</th>
                  <th className="py-2 px-4">Genre</th>
                  <th className="py-2 px-4">Taille</th>
                  <th className="py-2 px-4">Poids</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-4">
                      Aucun utilisateur trouvé.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="border-b">
                      <td className="py-2 px-4">{u.first_name}</td>
                      <td className="py-2 px-4">{u.last_name}</td>
                      <td className="py-2 px-4">{u.email}</td>
                      <td className="py-2 px-4">{u.phone || "-"}</td>
                      <td className="py-2 px-4">{u.birth_date || "-"}</td>
                      <td className="py-2 px-4">
                        {u.gender == "male" ? "Homme" : "Femme"}
                      </td>
                      <td className="py-2 px-4">{u.height || "-"}</td>
                      <td className="py-2 px-4">{u.weight || "-"}</td>
                      <td className="py-2 px-4">
                        <button
                          className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                          onClick={() => handleDeleteClick(u, "users")}
                          disabled={actionLoading}
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr className="bg-green-100">
                  <th className="py-2 px-4">Nom</th>
                  <th className="py-2 px-4">Email</th>
                  <th className="py-2 px-4">Téléphone</th>
                  <th className="py-2 px-4">Localisation</th>
                  <th className="py-2 px-4">Nombre de plats</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRestaurants.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      Aucun restaurant trouvé.
                    </td>
                  </tr>
                ) : (
                  filteredRestaurants.map((r) => (
                    <tr key={r.id} className="border-b">
                      <td className="py-2 px-4">{r.name}</td>
                      <td className="py-2 px-4">{r.email}</td>
                      <td className="py-2 px-4">{r.phone || "-"}</td>
                      <td className="py-2 px-4">{r.location || "-"}</td>
                      <td className="py-2 px-4 text-center">
                        <span className=" px-2 py-1 text-sm font-semibold">
                          {r.dishes_count || 0}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <button
                          className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                          onClick={() => handleDeleteClick(r, "restaurants")}
                          disabled={actionLoading}
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal Confirmation Suppression */}
        {showDeleteModal && itemToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Confirmer la suppression</h2>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="mb-4">
                Êtes-vous sûr de vouloir supprimer{" "}
                {itemType === "users" ? "l'utilisateur" : "le restaurant"}
                <span className="font-semibold">
                  {itemType === "users"
                    ? ` ${itemToDelete.first_name} ${itemToDelete.last_name}`
                    : ` ${itemToDelete.name}`}
                </span>{" "}
                ?
              </p>
              <p className="text-sm text-red-600 mb-6">
                Cette action est irréversible.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600"
                  disabled={actionLoading}
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50"
                  disabled={actionLoading}
                >
                  {actionLoading ? "Suppression..." : "Supprimer"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Confirmation Déconnexion */}
        {showLogoutModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Confirmer la déconnexion</h2>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="mb-4">
                Êtes-vous sûr de vouloir vous déconnecter ?
              </p>
              <p className="text-sm text-gray-600 mb-6">
                Vous devrez vous reconnecter pour accéder au tableau de bord.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600"
                >
                  Annuler
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
                >
                  Se déconnecter
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <AddRestaurantModal
        isOpen={showAddRestaurantModal}
        onClose={() => setShowAddRestaurantModal(false)}
        onSuccess={() => {
          setRefresh((r) => !r); // Rafraîchir la liste des restaurants
        }}
      />
    </div>
  );
};

export default AdminDashboard;
