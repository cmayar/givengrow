import { useAuth } from "./AuthContext.jsx";
import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const NavigationBar = () => {
  const { isSignedIn, setIsSignedIn } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsSignedIn(false);
    localStorage.removeItem("token");
    localStorage.setItem("isSignedIn", false);
    navigate("/");
  };

  return (
    <Navbar
      style={{ backgroundColor: "#3469b7", color: "white" }}
      variant="dark"
      expand="lg"
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
          Share Cycle
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            {isSignedIn ? (
              <>
                <Nav.Link as={Link} to="/dashboard">
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/profile">
                  Profile
                </Nav.Link>
                <Nav.Link onClick={handleLogout}>Log Out</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Log In
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
