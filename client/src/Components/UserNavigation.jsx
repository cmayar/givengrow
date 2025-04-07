import { Link } from "react-router-dom";


export const UserNavigationBar = () => {
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
            <Link to="/profile">
              Profile
            </Link>
            <Link to="/logout">
            Log Out
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default UserNavigationBar;