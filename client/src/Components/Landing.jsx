import { useState } from "react";
import LogInPage from "./LogIn";
import RegistrationPage from "./Registration";

function Landing() {
  //NOTE - temporary code
  const [view, setView] = useState("login");

  // ✅ Login logic handled here directly
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    localStorage.setItem("userToken", "your-temporary-token");
    console.log("Submitted login:", data);
  }

  // NOTE: not needed anymore
  // const [credentials, setCredentials] = useState({
  //   username: "",
  //   password: "",
  // });

  // const [error, setError] = useState(null);
  // const navigate = useNavigate();

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setCredentials({ ...credentials, [name]: value });
  // };

  // const login = async () => {
  //   try {
  //     const { data } = await axios("http://localhost:4000/auth/login", {
  //       method: "POST",
  //       data: credentials,
  //     });

  //     localStorage.setItem("token", data.token);
  //     navigate("/home");
  //   } catch (err) {
  //     console.error("Login failed:", err);
  //     setError(err.response?.data?.message || "Login failed");
  //   }
  // };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h1 className="text-center mb-4">Share & Borrow App</h1>
      <h2 className="text-center mb-4">Welcome!</h2>

      {/* Conditional rendering */}
      {view === "login" && (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              name="username"
              placeholder="Email address"
              value={data.username}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Password"
              value={data.password}
              onChange={handleChange}
            />
          </div>
          <div className="d-grid mb-3">
            <button
              type="submit"
              className="btn btn-primary fw-bold text-uppercase"
            >
              Sign In
            </button>
          </div>

          <div className="text-center">
            <small>
              Not a member?{" "}
              <span
                className="text-primary"
                style={{ cursor: "pointer" }}
                onClick={() => setView("register")}
              >
                Register
              </span>
            </small>
          </div>
        </form>
      )}

      {view === "register" && <RegistrationPage />}
    </div>
  );
}

export default Landing;
