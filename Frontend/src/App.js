import React from "react";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import LoginPage from "./components/Auth/Login/LoginPage";
import SignupPage from "./components/Auth/Signup/SignupPage";
import PrivateRoute from "./components/PrivateRoute"; // Import the PrivateRoute component
import Cookies from "js-cookie";

function App() {
  const token = Cookies.get("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<SignupPage />} />
        <Route path="/NotFound" element={<NotFound />} />

        {/* Protect the homepage route */}
        <Route
          path="/homepage"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        {/* Catch-all route for 404 pages */}
        <Route
          path="*"
          element={token ? <Navigate to="homepage" /> : <Navigate to="/" />}
        />
        {!token && <Route path="/" element={<LoginPage />} />}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
