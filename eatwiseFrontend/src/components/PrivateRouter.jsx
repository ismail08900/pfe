import { Navigate } from "react-router-dom";

// Utilise localStorage pour vérifier la présence du token restaurant
const PrivateRouter = ({ children }) => {
  const token = localStorage.getItem("restaurantToken");
  return token ? children : <Navigate to="/restaurant/login" />;
};

export default PrivateRouter;