import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./components/signup/Signup";
import "./App.css";
import Signin from "./components/signin/Signin";
import ForgotPassword from "./components/signin/ForgotPassword";
import Home from "./components/home/Home";
import ResetPassword from "./components/signin/ResetPassword";
import { useState, useEffect } from "react";
import Dashboard from "./components/dashboard/Dashboard";
import Navbar from "./components/navbar/Navbar";
import Profile from "./components/profile/Profile";

import { useUser } from "./context/UserContext";
import EditProfile from "./components/profile/EditProfile";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return JSON.parse(localStorage.getItem("isAuthenticated")) || false;
  });

  const { user, setUser } = useUser();
  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated);
  }, [isAuthenticated]);

  const handleSignin = (userData) => {
    setUser(userData);
  };

  const PrivateRoute = ({ isAuthenticated, children }) => {
    return isAuthenticated ? children : <Navigate to="/signin" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/signin"
          element={
            <Signin
              onSignin={handleSignin}
              setIsAuthenticated={setIsAuthenticated}
            />
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Navbar setIsAuthenticated={setIsAuthenticated} />
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/resetPassword/:token" element={<ResetPassword />} />
        <Route
          path="/profile/:id"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Navbar setIsAuthenticated={setIsAuthenticated} />
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/edit/:id"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Navbar setIsAuthenticated={setIsAuthenticated} />
              <EditProfile />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
