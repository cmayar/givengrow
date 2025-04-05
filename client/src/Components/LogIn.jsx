import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LogInPage() {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a POST request to beckend with the user's credentials
      const { data } = await axios("http://localhost:4000/auth/login", {
        method: "POST",
        data: credentials,
      });

      // Stores the received token in localStorage for future authenticated requests
      localStorage.setItem("token", data.token);

      // Redirects the user to the home page
      navigate("/home");
      setisSignedIn(true); // This updates the context for the navigation bar
      console.log("Login successful:", data);

    } catch (err) {
      console.error("Login failed:", err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div>
      <h1>Log In Page</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username"> Username: </label>
        <input
          type="text"
          id="username"
          name="username"
          value={credentials.username}
          onChange={handleChange}
        />
        <br />

        <label htmlFor="password"> Password: </label>
        <input
          type="password"
          id="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
        />
        <br />

        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default LogInPage;