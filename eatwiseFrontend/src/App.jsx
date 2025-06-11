import About from "./pages/About";
import LearnMore from "./pages/LearnMore";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Welcome from "./pages/Welcome";
import Home from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";
import UserRecipes from "./pages/UserRecipes";
import VerifyEmail from "./pages/VerifyEmail";
import EmailVerified from "./pages/EmailVerified";
import RecipeDetails from "./pages/RecipeDetails";
export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<Welcome />} />
          <Route path="about" element={<About />} />
          <Route path="learnmore" element={<LearnMore />} />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />{" "}
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/user-recipes"
            element={
              <PrivateRoute>
                <UserRecipes />
              </PrivateRoute>
            }
          />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/email-verified" element={<EmailVerified />} />
        <Route path="/recette/:id" element={<RecipeDetails />} />
      </Routes>
    </div>
  );
}
