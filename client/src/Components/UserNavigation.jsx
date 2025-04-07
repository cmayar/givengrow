import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // adjust path if needed

export const UserNavigationBar = () => {
  const { setIsSignedIn } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsSignedIn(false);
    localStorage.removeItem("token");
    localStorage.setItem("isSignedIn", "false"); // optional
    navigate("/"); // redirect to homepage after logout
  };

  return (
    <Navbar
      style={{ backgroundColor: "#3469b7", color: "white" }}
      variant="dark"
      expand="lg"
    >
      <Container>
        <Navbar.Brand as={Link} to="/"> Share Cycle</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/search">Search</Nav.Link>
            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
            <Nav.Link onClick={handleLogout}>Log Out</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default UserNavigationBar;
