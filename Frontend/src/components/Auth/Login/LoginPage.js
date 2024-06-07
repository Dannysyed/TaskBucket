import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../../api";

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

    if (!validateEmail(email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Invalid email address",
      }));
      valid = false;
    }

    if (!validatePassword(password)) {
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
        // Store token in localStorage or state
        localStorage.setItem("token", data.token);
        navigate("/homepage"); // Redirect to a protected route
      } catch (error) {
        setBackendError(error.message || "Invalid login credentials");
      }
    }
  };

  return (
    <div className="flex flex-row  justify-around items-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center">
        <img src={""} alt="Logo" className="w-40 h-40 mb-4" />{" "}
        {/* Update with the correct path to your logo image */}
        <h1 className="text-4xl font-bold">Task Bucket</h1>
      </div>
      <div className="bg-white px-10 py-20 rounded-3xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center mt-6">
          Welcome Back!
        </h1>
        <p className="font-medium text-lg text-gray-500 mt-2 text-center">
          Please enter your details
        </p>
        <form className="mt-8" onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="w-full border-2 border-gray-200 rounded-xl p-4 mt-1 bg-white focus:border-violet-500 focus:outline-none"
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
              className="block text-lg font-medium mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              className="w-full border-2 border-gray-200 rounded-xl p-4 mt-1 bg-white focus:border-violet-500 focus:outline-none"
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
              <label className="font-medium text-base" htmlFor="remember">
                Remember for 30 days
              </label>
            </div>
            <button
              type="button"
              className="font-medium text-base text-violet-500"
            >
              Forgot Password
            </button>
          </div>
          <div className="flex flex-col gap-y-4">
            <button
              type="submit"
              className="w-full active:scale-[.98] active:duration-75 hover:scale-[1.01] transition-transform py-3 rounded-xl bg-violet-500 text-white text-lg font-bold"
            >
              Sign in
            </button>
            <button
              type="button"
              className="w-full flex items-center justify-center py-3 rounded-xl border-2 border-gray-200 active:scale-[.98] active:duration-75 hover:scale-[1.01] transition-transform gap-2"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.26644 9.76453C6.19903 6.93863 8.85469 4.90909 12.0002 4.90909C13.6912 4.90909 15.2184 5.50909 16.4184 6.49091L19.9093 3C17.7821 1.14545 15.0548 0 12.0002 0C7.27031 0 3.19799 2.6983 1.24023 6.65002L5.26644 9.76453Z"
                  fill="#EA4335"
                />
                <path
                  d="M16.0406 18.0142C14.9508 18.718 13.5659 19.0926 11.9998 19.0926C8.86633 19.0926 6.21896 17.0785 5.27682 14.2695L1.2373 17.3366C3.19263 21.2953 7.26484 24.0017 11.9998 24.0017C14.9327 24.0017 17.7352 22.959 19.834 21.0012L16.0406 18.0142Z"
                  fill="#34A853"
                />
                <path
                  d="M19.8342 20.9978C22.0292 18.9503 23.4545 15.9019 23.4545 11.9982C23.4545 11.2891 23.3455 10.5255 23.1818 9.81641H12V14.4528H18.4364C18.1188 16.0119 17.2663 17.2194 16.0407 18.0108L19.8342 20.9978Z"
                  fill="#4A90E2"
                />
                <path
                  d="M5.27698 14.2663C5.03833 13.5547 4.90909 12.7922 4.90909 11.9984C4.90909 11.2167 5.03444 10.4652 5.2662 9.76294L1.23999 6.64844C0.436587 8.25884 0 10.0738 0 11.9984C0 13.918 0.444781 15.7286 1.23746 17.3334L5.27698 14.2663Z"
                  fill="#FBBC05"
                />
              </svg>
              Sign in with Google
            </button>
          </div>
          <div className="mt-8 flex justify-center items-center">
            <p className="font-medium text-base">Don't have an account?</p>
            <button
              type="button"
              onClick={handleSignUpClick}
              className="ml-2 font-medium text-base text-violet-500"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
