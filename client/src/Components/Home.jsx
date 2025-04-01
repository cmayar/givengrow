import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button, Card, Row, Col, Container, Navbar, Nav, Image } from 'react-bootstrap';

import headerImg from "../assets/images/header_image.png";
import defaultImage from "../assets/images/default_image.png";

const Home = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getItems();
  }, []);

  useEffect(() => {
    console.log("Updated items state:", items);
  }, [items]);

  //Fetch all Items
  const getItems = async () => {
    try {
      console.log("Fetching items...");
      const response = await axios.get("http://localhost:4000/api/items/");

      console.log("Axios response:", response);

      if (response.status !== 200) {
        console.error("Error fetching items:", response.statusText);
        return;
      }

      const fetchedItems = response.data.data; // Axios automatically parses JSON
      console.log("Fetched items:", fetchedItems);
      setItems(fetchedItems);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  console.log("Items state:", items);

  return (
    <>
      {/* //NOTE - Navbar goes here*/}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">Sharing Is Caring</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* <Link to="/profile" className="btn btn-outline-primary">
        Go to profile
      </Link> */}
      
      {/* //NOTE - header image */}
      <Container className="mt-3" style={{ position: "relative" }}>
        <Image
        src={ headerImg }
          alt="sharing is caring header image"
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
            width: "40%",
            padding: "20px",
          }}
        >
          <Card className="header-card"> 
            <Card.Body>
              <Card.Title>Welcome to Sharing app</Card.Title>
              <Card.Text>
                Share objects to help others, borrow objects that you need!
              </Card.Text>
                <Link to="/register" className="btn btn-outline-primary">
              Sign Up
              </Link>
            </Card.Body>
          </Card>
        </div>
      </Container>

      {/* //NOTE - Shared object container */}
      <Container className="mt-5">
        <h4>Need something? Explore!</h4>
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
                  <Card.Text>Category: {item.category}</Card.Text>
                  <Card.Text> {item.status}</Card.Text>
                  <Link to={`/items/${item.id}`}>
                    <Button variant="primary" className="mt-2">
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
