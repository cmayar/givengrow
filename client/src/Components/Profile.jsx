import React from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  // Hook for navigating to a new route
  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div
      className="profile-wrapper d-flex"
      style={{ minHeight: "100vh", height: "100vh", overflow: "hidden" }}
    >
      {/* Sidebar navigation */}
      <div
        className="sidebar bg-light p-4"
        style={{
          minWidth: "250px",
          height: "100vh",
          overflowY: "auto",
          position: "sticky",
          top: 0,
        }}
      >
        <h5 className="mb-4">Dashboard</h5>
        {/* //NOTE - I fix the route, now go to home  */}
        <Link to="/" className="btn btn-outline-primary w-100 mb-3">
          Go to Home
        </Link>

        {/* Sidebar navigation links */}
        <div className="list-group">
          {/* Link to post a new object */}
          <Link to="post" className="list-group-item list-group-item-action">
            Post new object
          </Link>

          {/* Link to view user's own objects */}
          <Link
            to="my-objects"
            className="list-group-item list-group-item-action"
          >
            My Objects
          </Link>

          {/* Link to view incoming requests */}
          <Link
            to="requests"
            className="list-group-item list-group-item-action"
          >
            Requests
          </Link>

          {/* Link to view borrowed items, when user can be both borrower or owner*/}
          <Link
            to="borrowed"
            className="list-group-item list-group-item-action"
          >
            Borrowed
          </Link>

          {/* Link to sign out */}
          <Link
            to="/"
            onClick={handleLogout}
            className="list-group-item list-group-item-action"
          >
            Sign Out
          </Link>
        </div>
      </div>

      {/* Main content area where nested routes will render */}
      <div className="main-content flex-grow-1 p-4">
        <div className="card shadow-sm p-4">
          <Outlet />{" "}
          {/* This renders nested routes inside the Profile layout */}
        </div>
      </div>
    </div>
  );
};

export default Profile;
