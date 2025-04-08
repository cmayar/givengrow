import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Container, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  // State to store the user data
  const [user, setUser] = useState(null);
  // State to track which fields are being edited
  const [isEditing, setIsEditing] = useState({
    username: false,
    email: false,
    phoneNumber: false,
    password: false,
  });

  // State to store the form data
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  // Hardcoded user ID for testing
  const userId = 1;

  //FIXME: Commented code to be uncommented when backend is ready
  //   useEffect(() => {
  //     const fetchUserData = async () => {
  //       try {
  //         const response = await axios.get(
  //           `http://localhost:4000/api/users/${userId}`
  //         );
  //         setUser(response.data);
  //         setFormData({
  //           username: response.data.username,
  //           email: response.data.email,
  //           phoneNumber: response.data.phoneNumber,
  //           password: response.data.password,
  //         });
  //       } catch (error) {
  //         console.error("Error fetching user data:", error);
  //       }
  //     };
  //     fetchUserData();
  //   }, []);

  // FIXME - Hardcoded user data (remove this once the backend is fixed)
  // Effect hook to set hardcoded user data for testing (replace with API call when backend is ready)
  useEffect(() => {
    setUser({
      id: 1,
      username: "tania",
      email: "tania@test.com",
      phoneNumber: "1234567890",
      password: "******",
    });

    setFormData({
      username: "tania",
      email: "tania@test.com",
      phoneNumber: "1234567890",
      password: "******",
    });
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission for updating user data (currently uses hardcoded data)
  const handleSubmit = async (e, field) => {
    e.preventDefault();
    const updatedData = { [field]: formData[field] };

    try {
      // FIXME: Uncomment this when backend is ready
      //   const response = await axios.put(
      //     `http://localhost:4000/api/users/${userId}`,
      //     updatedData
      //   );
      //   setUser(response.data);
      // FIXME: cancel this line once backend it's fixed as it's to temporarily update the user state wihtout API
      setUser({ ...user, [field]: formData[field] });
      setIsEditing((prev) => ({ ...prev, [field]: false }));
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  // Toggle edit mode for a specific field
  const handleEdit = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: true }));
  };

  // If no user data is available, return nothing (loading state or error handling can be added here)
  if (!user) {
    return null;
  }

  return (
    <Container className="container-profile mt-5">
      <Card className="card-profile">
        <Card.Body>
          <Card.Title className="card-title-profile text-center mt-3">{user.username}</Card.Title>

          {/* Username */}
          <Card.Text>
            <strong>Username: </strong>
            {isEditing.username ? (
              <Form onSubmit={(e) => handleSubmit(e, "username")}>
                <Form.Control
                className="profile-control"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
                <Button className="profile-button" type="submit">
                  Save Username
                </Button>
              </Form>
            ) : (
              <>
                {user.username}
                <Button
                  variant="link"
                  onClick={() => handleEdit("username")}
                  className="edit-button"
                >
                  Edit
                </Button>
              </>
            )}
          </Card.Text>

          {/* Email */}
          <Card.Text>
            <strong>Email:</strong>
            {isEditing.email ? (
              <Form onSubmit={(e) => handleSubmit(e, "email")}>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <Button type="submit" className="profile-button">
                  Save Email
                </Button>
              </Form>
            ) : (
              <>
                {user.email}
                <Button
     className="edit-button"
                  onClick={() => handleEdit("email")}
                >
                  Edit
                </Button>
              </>
            )}
          </Card.Text>

          {/* Phone number */}
          <Card.Text>
            <strong>Phone Number:</strong>
            {isEditing.phoneNumber ? (
              <Form onSubmit={(e) => handleSubmit(e, "phoneNumber")}>
                <Form.Control
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
                <Button variant="primary" type="submit" className="profile-button ">
                  Save Phone Number
                </Button>
              </Form>
            ) : (
              <>
                {user.phoneNumber}
                <Button
                  variant="link"
                  onClick={() => handleEdit("phoneNumber")}
                 className="edit-button"
                >
                  Edit
                </Button>
              </>
            )}
          </Card.Text>

          {/* Password */}
          <Card.Text>
            <strong>Password:</strong>
            {isEditing.password ? (
              <Form onSubmit={(e) => handleSubmit(e, "password")}>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <Button variant="primary" type="submit" className="profile-button">
                  Save Password
                </Button>
              </Form>
            ) : (
              <>
                {user.password}
                <Button
                  variant="link"
                  onClick={() => handleEdit("password")}
                  className="edit-button"
                >
                  Edit
                </Button>
              </>
            )}
          </Card.Text>

          {/* Navigation Buttons */}
          <div className="d-flex justify-content-center mt-4">
            <Link to="/home">
              <button className="profile-back-button m-2">
                Go to Home
              </button>
            </Link>
            <Link to="/dashboard">
              <button className="profile-back-button m-2">
                Go to Dashboard
              </button>
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;
