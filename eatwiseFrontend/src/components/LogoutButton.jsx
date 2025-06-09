import React from "react";
import { useUser } from "../contexts/useUser";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const { logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <button onClick={handleLogout} className="btn bg-red-600 text-white rounded-xl px-4 py-2">
      Se déconnecter
    </button>
  );
}