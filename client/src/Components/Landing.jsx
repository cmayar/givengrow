import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavigationBar from "./Navigation";

function Landing() {
  // State to store user input for login credentials
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  // State to handle and display login error messages
  const [error, setError] = useState(null);

  // Hook for navigating to a new route
  const navigate = useNavigate();

  // Handles form submission and login logic
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a POST request to beckend with the user's credentials
      const { data } = await axios("http://localhost:4000/api/login", {
        method: "POST",
        data: credentials,
      });

      // Stores the received token in localStorage for future authenticated requests
      localStorage.setItem("token", data.token);

      // Redirects the user to the home page
      navigate("/home");
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h1 className="text-center mb-4">Share & Borrow App</h1>
      <h2 className="text-center mb-4">Welcome!</h2>

      {/* Login Form */}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            name="username"
            placeholder="Email address"
            value={credentials.username}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
          />
        </div>

        {error && (
          <div className="alert alert-danger text-center py-1" role="alert">
            {error}
          </div>
        )}

        {/* Login button */}
        <div className="d-grid mb-3">
          <button
            type="submit"
            className="btn btn-primary fw-bold text-uppercase"
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
}

export default Landing;
