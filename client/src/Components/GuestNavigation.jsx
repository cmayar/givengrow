import { Link } from "react-router-dom";


export const GuestNavigationBar = () => {
  return (
    <div>
      <nav>
        <div>
          <Link to="/">
            <h1> Title </h1>
          </Link>
          <div>
            <Link to="/">
              Home
            </Link>
            <Link to="/search">
            Search
            </Link>
            <Link to="/login">
              Log In
            </Link>
            <Link to="/register">
            Register
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default GuestNavigationBar;