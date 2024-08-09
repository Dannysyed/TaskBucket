import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear authentication token from cookies
    Cookies.remove("token");

    // Optionally clear any other session data or user-specific info here

    // Redirect user to the login page or home page
    navigate("/login"); // Change this to your desired route
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-gray-600 text-xl">Logging out...</p>
    </div>
  );
};

export default Logout;
