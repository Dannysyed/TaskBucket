import React from "react";
import { Route, Routes, BrowserRouter,Navigate,Outlet } from "react-router-dom";
import {useSelector} from 'react-redux';
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import LoginPage from "./components/Auth/Login/LoginPage";
import SignupPage from "./components/Auth/Signup/SignupPage";
import HeaderPage from "./components/Header";
import "./App.css";

function App() {
  const user = useSelector(state => state.user);

  return (
    <BrowserRouter>
      <Routes>
      <Route element={<LoggedRoute user={user}/>}>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/NotFound" element={<NotFound />} />
        </Route>
        <Route element={<ProtectedRoute user={user} />}>
          <Route path="/homepage" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
const ProtectedRoute = ({ user, redirectPath = '/' }) => {
  if (!user || Object.keys(user).length === 0) {
    return <Navigate to={redirectPath} replace />;
  }

  return <div>
    <HeaderPage />
    <Outlet />
    </div>;
};

const LoggedRoute = ({ user, redirectPath = '/homepage' }) => {
  if (user && Object.keys(user).length > 0) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default App;
