import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/useUser";

export default function PrivateRoute({ children }) {
  const { token } = useUser();
  return token ? children : <Navigate to="/login" />;
}