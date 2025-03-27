import React from "react";
import { Link } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  return (
    <div className="container mt-5">
      <div className="row">
        {/* Dashboard section */}
        <div className="col-md-3">
          <div className="list-group">
            {/* <h4>Dashboard</h4>
            <nav
              id="sidebarMenu"
              className="collapse d-lg-block sidebar collapse bg-white"
            > */}
            {/* <div className="position-sticky"> */}
            <Link
              to="/share"
              // href="#"
              className="list-group-item list-group-item-action"
              aria-current="true"
            >
              {/* <i className="fas fa-tachometer-alt fa-fw me-3"></i> */}
              <span>Share</span>
            </Link>
            <Link
              to="/my-objects"
              href="#"
              className="list-group-item list-group-item-action"
            >
              {/* <i className="fas fa-chart-area fa-fw me-3"></i> */}
              <span>My Objects</span>
            </Link>
            <Link
              to="/requests"
              href="#"
              className="list-group-item list-group-item-action py-2 ripple"
            >
              {/* <i className="fas fa-lock fa-fw me-3"></i> */}
              <span>Requests</span>
            </Link>
            <Link
              to="/borrowed"
              href="#"
              className="list-group-item list-group-item-action py-2 ripple"
            >
              {/* <i className="fas fa-chart-line fa-fw me-3"></i> */}
              <span>Borrowed</span>
            </Link>
            <Link
              to="/signout"
              href="#"
              className="list-group-item list-group-item-action py-2 ripple"
            >
              {/* <i className="fas fa-chart-pie fa-fw me-3"></i> */}
              <span>SignOut</span>
            </Link>
          </div>
        </div>

        {/* </nav> */}

        {/* Items profile view */}
        <div className="col-md-9">
          <div className="card p-4">
            <h2>Objects</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
