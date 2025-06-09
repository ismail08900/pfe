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
import UserRecipes from "./components/UserRecipes";
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
          <Route path="/profile" element={<Profile />} />
          <Route path="/user-recipes" element={<UserRecipes />} />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}
