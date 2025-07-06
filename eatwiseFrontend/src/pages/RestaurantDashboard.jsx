import { useEffect, useState } from "react";
import { dietLabels, allergyLabels } from "../utils/labels";
import {
  PlusCircle,
  Edit,
  Trash,
  Utensils,
  Loader2,
  X,
  Image as ImageIcon,
  LogOut,
  KeyRound,
} from "lucide-react";
import apiRestaurant from "./apiRestaurant";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import ChangeRestaurantPasswordModal from "../components/ChangeRestaurantPasswordModal";
// ...

// Utilitaire pour afficher le type en français joli
const typeLabels = {
  "petit dejeuner": "Petit Déjeuner",
  dejeuner: "Déjeuner",
  diner: "Dîner",
  collation: "Collation",
};

const emptyForm = {
  name: "",
  description: "",
  price: "",
  calories: "",
  proteins: "",
  lipids: "",
  carbs: "",
  type: "petit dejeuner",
  diets: [],
  allergies: [],
  image: null,
};

const RestaurantDashboard = () => {
  const [dishes, setDishes] = useState([]);
  const [diets, setDiets] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dishToDelete, setDishToDelete] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [restaurantName, setRestaurantName] = useState("");

  const navigate = useNavigate();

  const handleLogout = async () => {
    // Optionnel : appel API pour logout côté serveur
    try {
      await apiRestaurant.post("/restaurant/logout");
    } catch (e) {
      /* ignore erreur */
    }

    // Suppression du token et infos resto
    localStorage.removeItem("restaurantToken");
    localStorage.removeItem("restaurantInfo");

    // Redirection vers la page de login restaurant
    navigate("/restaurant/login");
  };

  // Charger plats, régimes, allergies
  useEffect(() => {
    fetchAll();
    // Récupère le nom du restaurant depuis le localStorage
    const info = localStorage.getItem("restaurantInfo");
    if (info) {
      try {
        const parsed = JSON.parse(info);
        setRestaurantName(parsed.name || "");
      } catch(e) {console.log(e);}
    }
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [dishesRes, dietsRes, allergiesRes] = await Promise.all([
        apiRestaurant.get("/restaurant/dishes"),
        apiRestaurant.get("/diets-type"),
        apiRestaurant.get("/allergies"),
      ]);
      setDishes(dishesRes.data);
      setDiets(dietsRes.data);
      setAllergies(allergiesRes.data);
    } catch (err) {
      toast.error("Erreur lors du chargement des données.");
    } finally {
      setLoading(false);
    }
  };

  // Gestion formulaire
  const handleFormChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      setForm((prev) => ({
        ...prev,
        image: e.target.files[0],
      }));
      setPreview(
        e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : null
      );
    } else if (type === "select-multiple") {
      const selected = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setForm((prev) => ({
        ...prev,
        [name]: selected,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Ouvrir modale d'ajout/édition
  const openModal = (dish = null) => {
    if (dish) {
      setEditingId(dish.id);
      setForm({
        name: dish.name,
        description: dish.description,
        price: dish.price,
        calories: dish.calories,
        proteins: dish.proteins,
        lipids: dish.lipids,
        carbs: dish.carbs,
        type: dish.type,
        diets: dish.diets.map((d) => String(d.id)),
        allergies: dish.allergies.map((a) => String(a.id)),
        image: null, // on ne pré-remplit pas pour l'update
      });
      setPreview(
        dish.image
          ? `${import.meta.env.VITE_STORAGE_URL || "/storage/"}${dish.image}`
          : null
      );
    } else {
      setEditingId(null);
      setForm(emptyForm);
      setPreview(null);
    }
    setShowModal(true);
  };

  // Fermer modale
  const closeModal = () => {
    setShowModal(false);
    setForm(emptyForm);
    setPreview(null);
    setEditingId(null);
  };

  // Ajouter ou modifier un plat
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Préparation FormData
    const data = new FormData();
    data.append("name", form.name);
    data.append("description", form.description);
    data.append("price", form.price);
    data.append("calories", form.calories);
    data.append("proteins", form.proteins);
    data.append("lipids", form.lipids);
    data.append("carbs", form.carbs);
    data.append("type", form.type);
    form.diets.forEach((id, i) => data.append(`diets[${i}]`, id));
    form.allergies.forEach((id, i) => data.append(`allergies[${i}]`, id));
    if (form.image) data.append("image", form.image);

    try {
      if (editingId) {
        // Modification (PUT)
        await apiRestaurant.post(
          `/restaurant/dishes/${editingId}?_method=PUT`,
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        toast.success("Plat modifié !");
      } else {
        // Création (POST)
        await apiRestaurant.post("/restaurant/dishes", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Plat ajouté !");
      }
      fetchAll();
      closeModal();
    } catch (err) {
      if (err.response?.data?.errors) {
        Object.values(err.response.data.errors).forEach((msgArr) =>
          toast.error(msgArr[0])
        );
      } else {
        toast.error(
          err.response?.data?.message || "Erreur lors de l'enregistrement"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Suppression d'un plat
  const openDeleteModal = (dish) => {
    setDishToDelete(dish);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDishToDelete(null);
  };

  const confirmDelete = async () => {
    if (!dishToDelete) return;
    setLoading(true);
    try {
      await apiRestaurant.delete(`/restaurant/dishes/${dishToDelete.id}`);
      setDishes((prev) => prev.filter((d) => d.id !== dishToDelete.id));
      toast.success("Plat supprimé !");
      closeDeleteModal();
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center ml-2 md:ml-0">
            <Utensils className="text-gray-900" />
            <span className="font-bold text-2xl text-gray-900 ml-2">
              EatWise
            </span>
            <span className="ml-3">Restaurants</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center gap-2 text-sm font-medium text-gray-900 border border-gray-900 rounded-xl p-2"
            >
              <KeyRound size={16} />
              Changer le mot de passe
            </button>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-2 text-sm font-medium border border-red-500 p-2 rounded-xl text-red-500"
            >
              <LogOut size={16} />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto p-6">
        <div className="max-w-5xl mx-auto relative">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              Tableau de bord{restaurantName ? ` (${restaurantName})` : ""}
            </h1>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-700"
              onClick={() => openModal()}
            >
              <PlusCircle size={20} />
              Ajouter un plat
            </button>
          </div>

          {/* Tableau des plats */}
          <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-green-600" size={32} />
              </div>
            ) : dishes.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                Aucun plat enregistré.
              </div>
            ) : (
              <table className="min-w-full">
                <thead>
                  <tr className="text-sm text-gray-700 border-b">
                    <th className="py-2">Image</th>
                    <th>Nom</th>
                    <th>Type</th>
                    <th>Prix (DH)</th>
                    <th>Calories</th>
                    <th>Protéines</th>
                    <th>Lipides</th>
                    <th>Glucides</th>
                    <th>Régimes</th>
                    <th>Allergies</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dishes.map((dish) => (
                    <tr
                      key={dish.id}
                      className="border-b text-center text-xs sm:text-sm"
                    >
                      <td className="py-1">
                        {dish.image ? (
                          <img
                            src={`${
                              import.meta.env.VITE_STORAGE_URL || "/storage/"
                            }${dish.image}`}
                            alt={dish.name}
                            className="h-14 w-14 object-cover rounded"
                          />
                        ) : (
                          <ImageIcon
                            className="mx-auto text-gray-300"
                            size={28}
                          />
                        )}
                      </td>
                      <td>{dish.name}</td>
                      <td>{typeLabels[dish.type] || dish.type}</td>
                      <td>{dish.price}</td>
                      <td>{dish.calories}</td>
                      <td>{dish.proteins}</td>
                      <td>{dish.lipids}</td>
                      <td>{dish.carbs}</td>
                      <td>
                        <div className="flex flex-col gap-0.5">
                          {dish.diets.map((d) => (
                            <span
                              className="inline-block bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs"
                              key={d.id}
                            >
                              {dietLabels[d.name]}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col gap-0.5">
                          {dish.allergies.map((a) => (
                            <span
                              className="inline-block bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs"
                              key={a.id}
                            >
                              {allergyLabels[a.name]}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2 justify-center">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => openModal(dish)}
                            title="Modifier"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => openDeleteModal(dish)}
                            title="Supprimer"
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* Modale d'ajout/édition */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form
            className="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl animate-fade-in max-h-[90vh] flex flex-col"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <button
              type="button"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={closeModal}
              aria-label="Fermer"
              tabIndex={0}
            >
              <X size={28} />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
              {editingId ? "Modifier un plat" : "Ajouter un plat"}
            </h2>
            <div className="overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-3">
                  <label className="block text-gray-700 font-semibold mb-1">
                    Nom du plat
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    className="w-full pl-4 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 text-lg"
                    required
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-gray-700 font-semibold mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleFormChange}
                    className="w-full pl-4 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 text-lg"
                    required
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Prix (DH)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleFormChange}
                    className="w-full pl-4 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 text-lg"
                    required
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Type
                  </label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleFormChange}
                    className="w-full pl-4 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 text-lg"
                    required
                  >
                    <option value="petit dejeuner">Petit Déjeuner</option>
                    <option value="dejeuner">Déjeuner</option>
                    <option value="diner">Dîner</option>
                    <option value="collation">Collation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Calories (kcal)
                  </label>
                  <input
                    type="number"
                    name="calories"
                    value={form.calories}
                    onChange={handleFormChange}
                    className="w-full pl-4 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 text-lg"
                    required
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Protéines (g)
                  </label>
                  <input
                    type="number"
                    name="proteins"
                    value={form.proteins}
                    onChange={handleFormChange}
                    className="w-full pl-4 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 text-lg"
                    required
                    min={0}
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Lipides (g)
                  </label>
                  <input
                    type="number"
                    name="lipids"
                    value={form.lipids}
                    onChange={handleFormChange}
                    className="w-full pl-4 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 text-lg"
                    required
                    min={0}
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Glucides (g)
                  </label>
                  <input
                    type="number"
                    name="carbs"
                    value={form.carbs}
                    onChange={handleFormChange}
                    className="w-full pl-4 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 text-lg"
                    required
                    min={0}
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Régimes compatibles
                  </label>
                  <select
                    name="diets"
                    multiple
                    value={form.diets}
                    onChange={handleFormChange}
                    className="w-full pl-4 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 text-lg"
                    required
                  >
                    {diets.map((diet) => (
                      <option value={diet.id} key={diet.id}>
                        {dietLabels[diet.name] || diet.name}
                      </option>
                    ))}
                  </select>
                  <div className="text-xs text-gray-400">
                    (Ctrl+clic pour sélectionner plusieurs)
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Allergies compatibles
                  </label>
                  <select
                    name="allergies"
                    multiple
                    value={form.allergies}
                    onChange={handleFormChange}
                    className="w-full pl-4 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 text-lg"
                    required
                  >
                    {allergies.map((allergy) => (
                      <option value={allergy.id} key={allergy.id}>
                        {allergyLabels[allergy.name] || allergy.name}
                      </option>
                    ))}
                  </select>
                  <div className="text-xs text-gray-400">
                    (Ctrl+clic pour sélectionner plusieurs)
                  </div>
                </div>
                <div className="md:col-span-3">
                  <label className="block text-gray-700 font-semibold mb-1">
                    Image du plat
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    name="image"
                    onChange={handleFormChange}
                    className="w-full pl-4 pr-4 py-2 border rounded-xl"
                    required={!editingId}
                  />
                  {preview && (
                    <img
                      src={preview}
                      alt="aperçu"
                      className="h-20 w-20 object-cover rounded mt-2"
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 left-0 right-0 bg-white pt-6 pb-2 flex flex-col md:flex-row gap-4 justify-center z-10 border-t mt-4">
              <button
                type="submit"
                className="w-full md:w-auto btn bg-green-600 hover:bg-green-700 text-white text-lg font-bold rounded-xl px-8 py-3 shadow"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin mx-auto" size={22} />
                ) : editingId ? (
                  "Modifier"
                ) : (
                  "Ajouter"
                )}
              </button>
              <button
                type="button"
                className="w-full md:w-auto btn bg-gray-200 hover:bg-gray-300 text-gray-700 text-lg font-bold rounded-xl px-8 py-3 shadow"
                onClick={closeModal}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <ChangeRestaurantPasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-fade-in">
            <h2 className="text-xl font-bold text-center text-red-700 mb-4">
              Confirmer la suppression
            </h2>
            <p className="text-center mb-6">
              Voulez-vous vraiment supprimer le plat{" "}
              <span className="font-semibold">{dishToDelete?.name}</span> ?
              <br />
              Cette action est{" "}
              <span className="text-red-600 font-semibold">irréversible</span>.
            </p>
            <div className="flex gap-4 justify-center mt-6">
              <button
                className="btn bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl px-6 py-2 shadow"
                onClick={closeDeleteModal}
                disabled={loading}
              >
                Annuler
              </button>
              <button
                className="btn bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl px-6 py-2 shadow"
                onClick={confirmDelete}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin inline" size={18} />
                ) : (
                  "Supprimer"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-fade-in">
            <h2 className="text-xl font-bold text-center text-red-700 mb-4">
              Confirmer la déconnexion
            </h2>
            <p className="text-center mb-6">
              Voulez-vous vraiment vous déconnecter&nbsp;?
            </p>
            <div className="flex gap-4 justify-center mt-6">
              <button
                className="btn bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl px-6 py-2 shadow"
                onClick={() => setShowLogoutModal(false)}
              >
                Annuler
              </button>
              <button
                className="btn bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl px-6 py-2 shadow"
                onClick={handleLogout}
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RestaurantDashboard;
