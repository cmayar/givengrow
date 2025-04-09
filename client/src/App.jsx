import { React } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./Components/Home";
import Dashboard from "./Components/Dashboard";
import Item from "./Components/Item";
import Requests from "./Components/Requests";
import Borrowed from "./Components/Borrowed";
import Images from "./Components/ImageUploader.jsx";
import { AuthProvider } from "./Components/AuthContext.jsx";
import MyObjects from "./Components/MyObjects";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BadgeCountsProvider } from "./Components/BadgeCountsContext.jsx";
import Profile from "./Components/Profile.jsx";
import LogInPage from "./Components/LogIn.jsx";
import RegistrationPage from "./Components/Registration.jsx";
import NavigationBar from "./Components/NavigationBar.jsx";
import About from "./Components/About";

function App() {
  return (
    // AuthProvider component to manage authentication state and provide context for navigation bar
    <AuthProvider>
      {/* Router component to manage the routes and enable navigation */}
      <Router>
        {/* ToastContainer to show notifications */}
        <ToastContainer position="top-center" autoClose={3000} />

        {/* NavigationBar always visible */}
        <NavigationBar />

        {/* Routes define URL paths and corresponding components */}
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<LogInPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/items/:id" element={<Item />} />
          <Route path="/images" element={<Images />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />

          {/* Profile dashboardwith nested routes and shared sidebar layout */}
          {/* wrapped in BadgeCountsProvider */}
          <Route
            path="/dashboard"
            element={
              <BadgeCountsProvider>
                <Dashboard />
              </BadgeCountsProvider>
            }
          >
            <Route
              path="post"
              element={
                <div style={{ padding: "2rem" }}>
                  <h2>Post new object</h2>
                  
                </div>
              }
            />
            <Route path="my-objects" element={<MyObjects />} />
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
    </AuthProvider>
  );
}

export default App;
