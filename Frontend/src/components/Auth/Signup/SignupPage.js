import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../../api"; // Import the API function

export default function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [userType, setUserType] = useState("User");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    terms: "",
  });
  const [backendError, setBackendError] = useState("");

  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s-]*$/;
    return nameRegex.test(name);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleLoginClick = () => {
    navigate("/");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let valid = true;

    setErrors({
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
      terms: "",
    });
    setBackendError("");

    // Validation for name field
    if (!name.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "Name is required",
      }));
      valid = false;
    } else if (!validateName(name)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "Invalid name (only letters, spaces, and hyphens are allowed)",
      }));
      valid = false;
    }

    // Validation for the email field
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

    // Validation for the password field
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

    // Validation for the confirmPassword field
    if (!confirmPassword.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "Confirm Password is required",
      }));
      valid = false;
    } else if (password !== confirmPassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "Passwords do not match",
      }));
      valid = false;
    }

    // Validation for terms and conditions
    if (!terms) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        terms: "You must agree to the terms and conditions",
      }));
      valid = false;
    }

    if (valid) {
      try {
        const data = await registerUser({
          email: email,
          password: password,
          name: name,
          role: userType,
        });
        console.log("Signup successful:", data);
        // Redirect to the dashboard after successful registration
        navigate("/homepage");
      } catch (error) {
        setBackendError(error.message || "An error occurred during signup");
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
          Create your account
        </h1>
        <p className="font-medium text-lg text-gray-400 mt-2 text-center">
          Please enter your details
        </p>
        <form className="mt-8" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-lg font-medium mb-2 text-white"
              htmlFor="name"
            >
              Name
            </label>
            <input
              id="name"
              className="w-full border-2 border-gray-600 rounded-xl p-4 mt-1 bg-gray-700 text-white focus:border-violet-500 focus:outline-none"
              placeholder="Enter your name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div className="mb-4">
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
          <div className="mb-4">
            <label
              className="block text-lg font-medium mb-2 text-white"
              htmlFor="user-type"
            >
              User Type
            </label>
            <select
              id="user-type"
              className="w-full border-2 border-gray-600 rounded-xl p-4 mt-1 bg-gray-700 text-white focus:border-violet-500 focus:outline-none"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="mb-4">
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
          <div className="mb-6">
            <label
              className="block text-lg font-medium mb-2 text-white"
              htmlFor="confirm-password"
            >
              Confirm Password
            </label>
            <input
              id="confirm-password"
              className="w-full border-2 border-gray-600 rounded-xl p-4 mt-1 bg-gray-700 text-white focus:border-violet-500 focus:outline-none"
              placeholder="Confirm your password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                className="mr-2"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
              />
              <label
                className="font-medium text-base text-white"
                htmlFor="terms"
              >
                I agree to the terms and conditions
              </label>
            </div>
            {errors.terms && (
              <p className="text-red-500 text-sm mt-1">{errors.terms}</p>
            )}
          </div>
          {backendError && (
            <p className="text-red-500 text-sm mt-4 text-center">
              {backendError}
            </p>
          )}
          <div className="flex flex-col gap-y-4">
            <button
              type="submit"
              className="w-full active:scale              [0.98] active:duration-75 hover:scale-105 transition-transform py-3 rounded-xl bg-violet-500 text-white text-lg font-bold"
            >
              Sign up
            </button>
          </div>
          <div className="mt-8 flex justify-center items-center">
            <p className="font-medium text-base text-white">
              Already have an account?
            </p>
            <button
              type="button"
              onClick={handleLoginClick}
              className="ml-2 font-medium text-base text-violet-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
