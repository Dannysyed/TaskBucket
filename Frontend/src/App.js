import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import LoginPage from "./components/Auth/Login/LoginPage";
import SignupPage from "./components/Auth/Signup/SignupPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign" element={<SignupPage />} />
        <Route path="/NotFound" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
