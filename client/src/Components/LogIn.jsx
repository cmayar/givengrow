import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./LogIn.css";
import "./styles.css";

function LogInPage() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setIsSignedIn } = useAuth(); // grab setIsSignedIn from context

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios("http://localhost:4000/api/login", {
        method: "POST",
        data: credentials,
      });

      console.log("Login response:", data);

      const token = data?.token;
      const user = data?.user || data?.data?.[0];

      if (!token || !user || !user.id) {
        throw new Error("Invalid login response from server");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isSignedIn", "true"); // for auth context

      setIsSignedIn(true);
      navigate("/home");
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.response?.data?.message || err.message || "Login failed");
    }
  };

  return (
    <div className="form-container-login">
      <h1 className="title-login">Log In</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <label className="login-form-label" htmlFor="username">
          {" "}
          Username:{" "}
        </label>
        <input
          className="login-input"
          type="text"
          id="username"
          name="username"
          value={credentials.username}
          onChange={handleChange}
        />
        <br />

        <label className="login-form-label" htmlFor="password">
          {" "}
          Password:{" "}
        </label>
        <input
          className="login-input"
          type="password"
          id="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
        />
        <br />

        <input type="submit" value="Submit" />
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default LogInPage;
