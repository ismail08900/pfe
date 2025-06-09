import React, { createContext, useState, useEffect } from "react";
import api from "../api"; // adapte le chemin selon ton projet

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // Synchronise le header Authorization et le localStorage pour le token
  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete api.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token]);

  // Synchronise le localStorage pour l'user
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Fonction centralisée de déconnexion
  const logout = async () => {
    try {
      await api.post("/logout"); // Optionnel, selon ton backend
    } catch (e) {
        console.log(e);
      // ignore erreur
    }
    setUser(null);
    setToken(null);
    // Les useEffect s'occupent du nettoyage localStorage et header
  };

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken, logout }}>
      {children}
    </UserContext.Provider>
  );
}

