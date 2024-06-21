import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./components/signup/Signup";
import "./App.css";
import Signin from "./components/signin/Signin";
import ForgotPassword from "./components/signin/ForgotPassword";
import Home from "./components/home/Home";
import ResetPassword from "./components/signin/ResetPassword";
import { useState, useEffect } from "react";

import Navbar from "./components/navbar/Navbar";
import Profile from "./components/profile/Profile";
import { useUser } from "./context/UserContext";
import EditProfile from "./components/profile/EditProfile";
import Sidebar from "./components/sidebar/Sidebar";

function App() {
  const [isSearching, isUserSearching] = useState(false);
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
    if (!isAuthenticated) {
      return <Navigate to="/signin" />;
    }

    return (
      <>
        <Navbar
          setIsAuthenticated={setIsAuthenticated}
          isUserSearching={isUserSearching}
        />
        <div>
          <Sidebar isUserSearching={isUserSearching} />
          <main>{children}</main>
        </div>
      </>
    );
  };

  return (
    <>
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
                <Home
                  setIsAuthenticated={setIsAuthenticated}
                  isSearching={isSearching}
                  isUserSearching={isUserSearching}
                />
              </PrivateRoute>
            }
          />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/resetPassword/:token" element={<ResetPassword />} />
          <Route
            path="/profile/:id"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/edit/:id"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <EditProfile />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
