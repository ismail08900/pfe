import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Composant de protection des routes Admin.
 * Utilisation :
 *   <AdminPrivateRoute>
 *      <DashboardAdmin />
 *   </AdminPrivateRoute>
 */
const AdminPrivateRoute = ({ children }) => {
  const adminToken = localStorage.getItem("adminToken");
  if (!adminToken) {
    // Non connecté : redirection vers le login admin
    return <Navigate to="/admin/login" replace />;
  }
  // Connecté : accès au composant enfant
  return children;
};

export default AdminPrivateRoute;