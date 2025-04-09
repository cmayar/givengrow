import React from "react";
import { useState } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { useBadgeCounts } from "./BadgeCountsContext";
import "./Dashboard.css";

const Dashboard = () => {
  // Hook for navigating to a new route
  const navigate = useNavigate();

  // Use custom hook
  const { requestsCount, borrowedCount } = useBadgeCounts();

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

        {/* Sidebar navigation links */}
        <div className="list-group">
          {/* Link to post a new object */}
          <Link to="post" className="list-group-item list-group-item-action">
            Post New Item
            
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
            {/* count section */}
            {requestsCount > 0 && (
              <span className="badge bg-primary rounded-pill float-end">
                {requestsCount}
              </span>
            )}
          </Link>

          {/* Link to view borrowed items, when user can be both borrower or owner*/}
          <Link
            to="borrowed"
            className="list-group-item list-group-item-action"
          >
            Borrowed
            {/* count section */}
            {borrowedCount > 0 && (
              <span className="badge bg-primary rounded-pill float-end">
                {borrowedCount}
              </span>
            )}
          </Link>

          {/* Link to sign out */}
          <Link
            to="/"
            onClick={handleLogout}
            className="list-group-item list-group-item-action"
          >
            Sign Out
          </Link>

          <Link to="/home" className="btn button-back">
            Go to Home
          </Link>
        </div>
      </div>

      {/* Main content area where nested routes will render */}
      <div className="main-content flex-grow-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
