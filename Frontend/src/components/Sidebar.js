import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const logout = () => {
    // Remove the token from cookies
    Cookies.remove("token");

    // Redirect to the login page
    navigate("/LoginPage");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="md:flex md:flex-col md:w-64 md:h-screen bg-gray-900 text-white shadow-lg">
      {/* Mobile toggle button */}
      <div className="md:hidden flex justify-between items-center bg-gray-900 text-white p-4">
        <div className="text-2xl font-bold">Dashboard</div>
        <button
          onClick={toggleMenu}
          className="focus:outline-none"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Sidebar content */}
      <div className={`md:block ${isOpen ? "block" : "hidden"} pt-4 pb-2 md:p-4`}>
        <div className="text-2xl font-bold text-center md:text-left mb-4">Task Bucket</div>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link
                to="/homepage"
                className="block py-2.5 px-4 rounded hover:bg-gray-700 transition duration-300"
                onClick={closeMenu}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/tasks"
                className="block py-2.5 px-4 rounded hover:bg-gray-700 transition duration-300"
                onClick={closeMenu}
              >
                Tasks Detail
              </Link>
            </li>
          </ul>
        </nav>
        <div className="mt-auto pt-4 border-t border-gray-700">
          <button
            onClick={logout}
            className="w-full py-2.5 px-4 rounded text-left hover:bg-red-600 transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;