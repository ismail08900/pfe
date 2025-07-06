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
import Diets from "./pages/Diets";
import Planning from "./pages/Planning";
import Dashboard from "./pages/Dashboard";
import RestaurantRegister from "./pages/RestaurantRegister";
import RestaurantLogin from "./pages/RestaurantLogin";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import PrivateRouter from "./components/PrivateRouter";
import AdminPrivateRoute from "./components/AdminPrivateRoute";
import AllDishes from "./pages/AllDishes";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<Welcome />} />
          <Route path="about" element={<About />} />
          <Route path="/diets" element={<Diets />} />
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
          <Route
            path="/planning"
            element={
              <PrivateRoute>
                <Planning />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/restaurant-dishes"
            element={
              <PrivateRoute>
                <AllDishes />
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
        <Route path="/restaurant/register" element={<RestaurantRegister />} />
        <Route path="/restaurant/login" element={<RestaurantLogin />} />
        <Route
          path="/restaurant/dashboard"
          element={
            <PrivateRouter>
              <RestaurantDashboard />
            </PrivateRouter>
          }
        />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminPrivateRoute>
              <AdminDashboard />
            </AdminPrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}
