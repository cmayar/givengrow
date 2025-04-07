import { Link } from "react-router-dom";

const { setIsSignedIn } = useAuth();
setIsSignedIn(false);
localStorage.removeItem("token");
localStorage.setItem("isSignedIn", "false"); // optional since `setIsSignedIn(false)` will do this now


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
            <Link to="/dashboard">
              Dashboard
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