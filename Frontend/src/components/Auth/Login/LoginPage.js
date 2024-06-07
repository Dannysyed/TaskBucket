import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../../api";
const LoginPage = () => {
  const Navigate = useNavigate();
  const handleClick = () => [Navigate("/Sign")];
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(credentials);
      console.log("Login successful:", data);
      // Store token in localStorage or state
      localStorage.setItem("token", data.token);
    } catch (error) {
      setError(error.error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>
        {error && <p>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default LoginPage;
