import React, { useEffect, useState } from "react";
import { useUser } from "../contexts/useUser";
import api from "../api";
import LogoutButton from "../components/LogoutButton";
import UserRecipes from "../pages/UserRecipes";

export default function Home() {
  const { user, token } = useUser();
  const [fullUser, setFullUser] = useState(user);
  const [diets, setDiets] = useState([]);
  const [showRecipes, setShowRecipes] = useState(false);

  useEffect(() => {
    if (token) {
      api.get("/me").then((res) => setFullUser(res.data));
      api.get("/diets-type").then((res) => setDiets(res.data));
    }
  }, [token]);

  if (!token) return <div>Non connecté</div>;
  if (!fullUser) return <div>Chargement...</div>;

  // Trouver le nom du régime par l'id
  const getDietName = (id) =>
    diets.find((d) => d.id === id)?.name || "Non renseigné";

  // Récupérer la liste des allergies (array d'objets {id, name})
  const userAllergies =
    fullUser.allergies && Array.isArray(fullUser.allergies)
      ? fullUser.allergies
      : [];

  return (
    <>
      <div>
        <h1>Hello {fullUser.first_name} !</h1>
        <ul>
          <li>Prénom : {fullUser.first_name}</li>
          <li>Nom : {fullUser.last_name}</li>
          <li>Email : {fullUser.email}</li>
          <li>Téléphone : {fullUser.phone}</li>
          <li>Date de naissance : {fullUser.birth_date}</li>
          <li>
            Régime alimentaire : {getDietName(fullUser.diet_type_id)}
          </li>
          <li>
            Allergies :
            {userAllergies.length === 0 ? (
              <span> Aucune</span>
            ) : (
              <ul>
                {userAllergies.map((a) => (
                  <li key={a.id}>{a.name}</li>
                ))}
              </ul>
            )}
          </li>
        </ul>
        <button onClick={() => setShowRecipes(true)}>
          Afficher mes plats compatibles
        </button>
        {showRecipes && <UserRecipes />}
      </div>
      <LogoutButton />
    </>
  );
}