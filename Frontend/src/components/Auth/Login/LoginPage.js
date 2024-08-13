import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../../api";
import Cookies from "js-cookie";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [backendError, setBackendError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSignUpClick = () => {
    navigate("/register");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let valid = true;

    // Reset errors
    setErrors({ email: "", password: "" });
    setBackendError("");

    // Validate email
    if (!email.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Email is required",
      }));
      valid = false;
    } else if (!validateEmail(email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Invalid email address",
      }));
      valid = false;
    }

    // Validate password
    if (!password.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password is required",
      }));
      valid = false;
    } else if (!validatePassword(password)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password must be at least 6 characters",
      }));
      valid = false;
    }

    if (valid) {
      try {
        const data = await loginUser({
          email: email,
          password: password,
          name: "user",
        });
        console.log("Login successful:", data);
        // Store token in cookies
        Cookies.set("token", data.token, { expires: 1 }); // Expires in 1 day
        navigate("/homepage"); // Redirect to the homepage
      } catch (error) {
        setBackendError(error.message || "Invalid login credentials");
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-around items-center min-h-screen bg-gray-900 p-6 lg:p-12">
      <div className="flex flex-col items-center mb-6 lg:mb-0">
        <img
          src={"logo.png"}
          alt="Task Bucket Logo"
          className="w-40 h-40 mb-4"
        />
        <h1 className="text-4xl font-bold text-white">Task Bucket</h1>
      </div>
      <div className="bg-gray-800 px-10 py-8 rounded-3xl shadow-lg w-full lg:w-3/5 xl:w-2/5">
        <h1 className="text-3xl font-semibold text-center mt-6 text-white">
          Welcome Back!
        </h1>
        <p className="font-medium text-lg text-gray-400 mt-2 text-center">
          Please enter your details
        </p>
        <form className="mt-8" onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              className="block text-lg font-medium mb-2 text-white"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              className="w-full border-2 border-gray-600 rounded-xl p-4 mt-1 bg-gray-700 text-white focus:border-violet-500 focus:outline-none"
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div className="mb-6">
            <label
              className="block text-lg font-medium mb-2 text-white"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              className="w-full border-2 border-gray-600 rounded-xl p-4 mt-1 bg-gray-700 text-white focus:border-violet-500 focus:outline-none"
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          {backendError && (
            <p className="text-red-500 text-sm mt-4 text-center">
              {backendError}
            </p>
          )}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                name="remember"
                className="mr-2"
              />
              <label
                className="font-medium text-base text-white"
                htmlFor="remember"
              >
                Remember for 30 days
              </label>
            </div>
          </div>
          <div className="flex flex-col gap-y-4">
            <button
              type="submit"
              className="w-full active:scale-[.98] active:duration-75 hover:scale-[1.01] transition-transform py-3 rounded-xl bg-violet-500 text-white text-lg font-bold"
            >
              Sign in
            </button>
          </div>
        </form>
        <div className="mt-6 flex justify-center items-center">
          <p className="font-medium text-base text-white">
            Don't have an account?
          </p>
          <button
            type="button"
            onClick={handleSignUpClick}
            className="ml-2 font-medium text-base text-violet-500"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
