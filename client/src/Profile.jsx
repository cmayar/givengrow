import React from 'react'

const Profile = () => {
    return (
        <div className="container mt-5">
          <div className="row">
            {/* Dashboard section */}
            <div className="col-md-3">
              <div className="card p-4">
                <h4>Dashboard</h4>
                <nav id="sidebarMenu" class="collapse d-lg-block sidebar collapse bg-white">
    <div class="position-sticky">
      <div class="list-group list-group-flush mx-3 mt-4">
        <a href="#" class="list-group-item list-group-item-action py-2 ripple" aria-current="true">
          <i class="fas fa-tachometer-alt fa-fw me-3"></i><span>Share</span>
        </a>
        <a href="#" class="list-group-item list-group-item-action py-2 ripple active ">
          <i class="fas fa-chart-area fa-fw me-3"></i><span>My Objects</span>
        </a>
        <a href="#" class="list-group-item list-group-item-action py-2 ripple"><i
            class="fas fa-lock fa-fw me-3"></i><span>Requests</span></a>
        <a href="#" class="list-group-item list-group-item-action py-2 ripple"><i
            class="fas fa-chart-line fa-fw me-3"></i><span>Borrowed</span></a>
        <a href="#" class="list-group-item list-group-item-action py-2 ripple">
          <i class="fas fa-chart-pie fa-fw me-3"></i><span>SignOut</span>
        </a>
      </div>
    </div>
  </nav>
              </div>
            </div>
            {/* Items profile view */}
            <div className="col-md-9">
              <div className="card p-4">
                <h2>Objects</h2>
              </div>
            </div>
          </div>
        </div>
      )
    }

export default Profile