import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Landing() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const login = async () => {
    try {
      const { data } = await axios("http://localhost:4000/auth/login", {
        method: "POST",
        data: credentials,
      });

      localStorage.setItem("token", data.token);
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

      <input
        value={credentials.username}
        onChange={handleChange}
        name="username"
        type="text"
        className="form-control mb-2"
        placeholder="Username"
        required
      />
      <input
        value={credentials.password}
        onChange={handleChange}
        name="password"
        type="password"
        className="form-control mb-2"
        placeholder="Password"
        required
      />

      {error && <p className="text-danger text-center">{error}</p>}

      <div className="d-grid">
        <button className="btn btn-primary" onClick={login}>
          Log in
        </button>
      </div>
    </div>
  );
}

export default Landing;
