import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Sidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    // Remove the token from cookies
    Cookies.remove("token");

    // Redirect to the login page
    navigate("/");
  };

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col shadow-lg">
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
        Dashboard
      </div>
      <nav className="flex-1 pt-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/homepage"
              className="block py-2.5 px-4 rounded hover:bg-gray-700 transition duration-300"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/tasks"
              className="block py-2.5 px-4 rounded hover:bg-gray-700 transition duration-300"
            >
              Tasks Detail
            </Link>
          </li>
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="w-full py-2.5 px-4 rounded text-left hover:bg-red-600 transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
