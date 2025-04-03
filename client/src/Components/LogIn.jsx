import { useState } from "react";

function LogInPage() {
  const [data, setData] = useState({
    username: "",
    password: "",
  });


  function handleChange(e) {

  }
  

  function setError(e) {
    
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios("http://localhost:4000/auth/login", {
        method: "POST",
        data: credentials,
      });

      localStorage.setItem("token", data.token);
      navigate("/");
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
          value={data.username}
          onChange={handleChange}
        />
        <br />

        <label htmlFor="password"> Password: </label>
        <input
          type="password"
          id="password"
          name="password"
          value={data.password}
          onChange={handleChange}
        />
        <br />

        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default LogInPage;
