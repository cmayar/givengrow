import React from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    // NOTE old version
    // <div className="profile-wrapper mt-5">
    //   {/* Sidebar */}
    //   <div className="sidebar bg-light p-4">
    //     {/* <div className="col-md-3"> */}
    //     <h5 className="mb-4">Dashboard</h5>
    //     <Link to="/home" className="btn btn-outline-primary w-100 mb-3">
    //       Go to Home
    //     </Link>
    //     <div className="list-group">
    //       <Link
    //         to="/post"
    //         // href="#"
    //         className="list-group-item list-group-item-action"
    //         aria-current="true"
    //       >
    //         {/* <i className="fas fa-tachometer-alt fa-fw me-3"></i> */}
    //         <span>Post new object</span>
    //       </Link>
    //       <Link
    //         to="/my-objects"
    //         href="#"
    //         className="list-group-item list-group-item-action"
    //       >
    //         {/* <i className="fas fa-chart-area fa-fw me-3"></i> */}
    //         <span>My Objects</span>
    //       </Link>
    //       <Link
    //         to="/requests"
    //         href="#"
    //         className="list-group-item list-group-item-action py-2 ripple"
    //       >
    //         {/* <i className="fas fa-lock fa-fw me-3"></i> */}
    //         <span>Requests</span>
    //       </Link>
    //       <Link
    //         to="/borrowed"
    //         href="#"
    //         className="list-group-item list-group-item-action py-2 ripple"
    //       >
    //         {/* <i className="fas fa-chart-line fa-fw me-3"></i> */}
    //         <span>Borrowed</span>
    //       </Link>

    //       <Link
    //         to="/"
    //         onClick={handleLogout}
    //         className="list-group-item list-group-item-action"
    //       >
    //         {/* <i className="fas fa-chart-pie fa-fw me-3"></i> */}
    //         <span>SignOut</span>
    //       </Link>
    //     </div>
    //   </div>

    //   {/* </nav> */}

    //   {/* Main content (dynamic)*/}
    //   <div className="main-content p-4">
    //     <div className="card shadow-sm p-4">
    //       <h2 className="mb-3">Objects</h2>
    //       {/* Here goes the conditional render for what is clicked */}
    //     </div>
    //   </div>
    //   {/* </div> */}
    // </div>

    <div
      className="profile-wrapper d-flex"
      style={{ minHeight: "100vh", height: "100vh", overflow: "hidden" }}
    >
      {/* Sidebar */}
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
        <Link to="home" className="btn btn-outline-primary w-100 mb-3">
          Go to Home
        </Link>
        <div className="list-group">
          <Link to="post" className="list-group-item list-group-item-action">
            Post new object
          </Link>
          <Link
            to="my-objects"
            className="list-group-item list-group-item-action"
          >
            My Objects
          </Link>
          <Link
            to="requests"
            className="list-group-item list-group-item-action"
          >
            Requests
          </Link>
          <Link
            to="borrowed"
            className="list-group-item list-group-item-action"
          >
            Borrowed
          </Link>
          <Link
            to="/"
            onClick={handleLogout}
            className="list-group-item list-group-item-action"
          >
            Sign Out
          </Link>
        </div>
      </div>

      {/* Main content area that changes based on nested routes */}
      <div className="main-content flex-grow-1 p-4">
        <div className="card shadow-sm p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Profile;
