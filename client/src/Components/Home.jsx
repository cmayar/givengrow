import React, { use } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button, Card, Row, Col, Container, Navbar, Nav, Image } from 'react-bootstrap';
import './home.css';
import './styles.css';
import headerImg from "../assets/images/header_image.jpg";
import defaultImage from "../assets/images/default_image.png";

// Home component displays shared items and filters them by category
const Home = () => {
  // State to store all fetched items
  const [items, setItems] = useState([]);

  // State to store selected category from dropdown
  const [selectedCategory, setSelectedCategory] = useState("");

  // Categories used for dropdown filter as per ENUM in DB
  const categories = [
    "tools",
    "outdoor",
    "kitchenware",
    "cleaning",
    "electronics",
    "sports",
    "furniture",
    "events",
    "childrens",
    "seasonal",
    "crafts",
    "media",
    "vehicles",
    "misc",
  ];

  // Fetch all items when the component mounts
  useEffect(() => {
    getItems();
  }, []);

  // Re-fetch items when selected category changes
  useEffect(() => {
    if (selectedCategory === "") {
      getItems(); // If no category selected, fetch all items
    } else {
      filteredByCategory(selectedCategory); // Otherwise, filter by selected category
    }
  }, [selectedCategory]);

  // Fetch all items form beckend
  const getItems = async () => {
    try {
      console.log("Fetching items...");
      const response = await axios.get("http://localhost:4000/api/items/");
      console.log("Axios response:", response);

      // Set items state or fallback to empty array to avoid crashes
      setItems(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching items:", error);
      setItems([]);
    }
  };

  // Fetch items filtered by category from backend
  const filteredByCategory = async (category) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/items/filter?key=category&value=${category}`
      );
      console.log("Filtered response:", response.data);
      setItems(response.data || []);
    } catch (error) {
      console.error("Error filtering items:", error);
      setItems([]);
    }
  };

  return (
    <>
      {/* //NOTE - Navbar goes here waiting mattea's one */}
      <Navbar style={{ backgroundColor: '#A59AAA', color: 'white' }} variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">Share&Borrow</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/home">Home</Nav.Link>
              <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
      {/* //NOTE - header image */}
      <Container className="mt-3" style={{ position: "relative" }}>
        <Image
        src={ headerImg }
          alt="shareapp header image"
          fluid 
          className="mb-4" 
          style={{ width: '100%', height: 'auto' }}
        />
        <div 
          style={{
            position: "absolute", 
            top: "30%", 
            left: "0%", 
            zIndex: 1,
            width: "40%",
            padding: "20px",
          }}
        >
          <Card className="custom-card header-card"> 
            <Card.Body>
              <Card.Title>Welcome to Sharing app</Card.Title>
              <Card.Text>
                Share objects to help others, borrow objects that you need!
              </Card.Text>
                <Link to="/post" style={{ textDecoration: 'none' }} className="button">
              Start sharing!
              </Link>
            </Card.Body>
          </Card>
        </div>
      </Container>

   <h4 className="subtitle">Need something? Explore!</h4>
      {/* Category dropdown filter */}
      <div className="category-filter-container mt-3">
        {/* <label htmlFor="categoryFilter" className="form-label">
          Filter by category:
        </label> */}
        <select
          id="categoryFilter"
          className="form-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {/* Option to show all items */}
          <option value="">All categories</option>

          {/* Loop through categories to build dropdown options */}
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* List of shared objects */}
      
      {/* //NOTE - Shared object container */}
      <Container className="mt-5">
        <Row>
        {items.length > 0 ? (
          items.map((item) => (
            <Col md={3} sm={6} xs={12} mb={3} key={item.id}>
              <Card className="p-3" border="0">
                <Card.Body>
                  {/* Imagen cuadrada */}
                  <div className="card-img-container">
                    {/* //REVIEW - need to change this logic when upload is ready */}
                    <Image
                      src={item.imageUrl ? item.imageUrl : defaultImage}
                      alt="Item Image"
                      className="card-img"
                    />
                  </div>
                  <Card.Title>{item.title}</Card.Title>
                  <Card.Text>{item.description}</Card.Text>
                  <Card.Text><strong>Category:</strong> {item.category}</Card.Text>
                  <Card.Text> {item.status}</Card.Text>
                  <Card.Text><strong>Owner:</strong> {item.owner_name}</Card.Text> {/* Display the owner's username */}
                  <Link to={`/items/${item.id}`}>
                    <Button variant="primary" className="button mt-2">
                      Show more
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No items available</p>
        )}
      </Row>
    </Container>
    </>
  );
};

export default Home;
