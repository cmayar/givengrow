import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Registration.css";
import "./styles.css";

function RegistrationPage() {
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    phonenumber: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setCredentials((prevData) => {
      const newState = { ...prevData, [name]: value };
      console.log("Updated State:", newState);
      return newState;
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a POST request to beckend with the user's credentials
      const { data } = await axios("http://localhost:4000/auth/register", {
        method: "POST",
        data: credentials,
      });

      // Stores the received token in localStorage for future authenticated requests
      localStorage.setItem("token", data.token);

      // Redirects the user to the home page
      navigate("/home");
    } catch (err) {
      console.error("Registration failed:", err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div>
      <h1>Registration</h1>
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

        <label htmlFor="email"> Email: </label>
        <input
          type="text"
          id="email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
        />
        <br />

        <label htmlFor="phonenumber"> Phone number: </label>
        <input
          type="text"
          id="phonenumber"
          name="phonenumber"
          value={credentials.phonenumber}
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

export default RegistrationPage;