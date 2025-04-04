import { React } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Profile from "./Components/Profile";
import Item from "./Components/Item";
import LogInPage from "./Components/LogIn";
import RegistrationPage from "./Components/Registration";
import Landing from "./Components/Landing";
import Requests from "./Components/Requests";
import Borrowed from "./Components/Borrowed";
import Images from "./Components/ImageUploader.jsx";
// import MyObjects from "./Components/MyObjects";
import MyObjects from "./Components/MyObjects";

function App() {
  return (
    // Router component to manage the routes and enable navigation
    <Router>
      {/* This is already in Landin.jsx*/}
      {/* <div>
        <h1> Share & Borrow app</h1>
        <h2> Welcome! </h2>
      </div> */}

      {/* Routes define URL paths and corresponding components */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/items/:id" element={<Item />} />
        <Route path="/images" element={<Images />} />

        {/* Profile dashboardwith nested routes and shared sidebar layout */}
        <Route path="/profile" element={<Profile />}>
          <Route
            path="post"
            element={
              <div style={{ padding: "2rem" }}>
                <h2>Post new object</h2>
              </div>
            }
          />
          <Route path="my-objects" element={<MyObjects />} />
          <Route
            path="my-objects"
            element={
              <div style={{ padding: "2rem" }}>
                <h2>My Objects</h2>
              </div>
            }
          />
          <Route path="requests" element={<Requests />} />
          <Route path="borrowed" element={<Borrowed />} />
          <Route
            path="signout"
            element={
              <div style={{ padding: "2rem" }}>
                <h2>Signed Out</h2>
              </div>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
