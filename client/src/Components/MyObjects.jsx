import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Container, Row, Col, Image } from "react-bootstrap";
import "./MyObject.css";
import "./item.css";
import "./styles.css";
import defaultImage from "../assets/images/default_image.png";

const MyObjects = () => {
  const [objects, setObjects] = useState([]); // Store the objects

  useEffect(() => {
    fetchMyObjects();
  }, []);

  const fetchMyObjects = async () => {
    try {
      const token = localStorage.getItem("token"); // Get token from logged-in user

      const response = await axios.get(
        "http://localhost:4000/api/items/my-objects",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in the Authorization header
          },
        }
      );
      // console.log("Fetched Objects:", response.data);
      setObjects(response.data.data); // Save objects in the state
      // console.log("Updated Objects State:", response.data.data);
    } catch (err) {
      console.error("Error fetching user's objects:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete (`http://localhost:4000/api/items/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in the Authorization header
        },
      });

       // Update the state to remove the deleted object
       setObjects((prevObjects) =>
        prevObjects.filter((object) => object.id !== id)
      );
      console.log(`Item with ID ${id} deleted successfully.`);
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };


  return (
    <Container>
      <h3 className="title-style">My Objects</h3>
      <Row>
        {objects.length > 0 ? (
          objects.map((object) => {
            return (
              <Col md={4} sm={6} xs={12} key={object.id}>
                <Card className="my-object-card p-3" border="0">
                  <Card.Body>
                    <div className="card-img-container">
                      <Image
                        src={object.image || defaultImage} // Use defaultImage if object.image is falsy
                        alt="Item Image"
                        className="object-card-img"
                        onError={(e) => {
                          e.target.onerror = null; // Prevent infinite loop
                          e.target.src = defaultImage; // Fallback to default image
                        }}
                      />
                    </div>
                    <Card.Title>{object.title}</Card.Title>
                    <Card.Text>{object.description}</Card.Text>
                    <Card.Text>
                      <strong>Category:</strong> {object.category}
                    </Card.Text>
                    <Card.Text
                      className={
                        object.status === "available"
                          ? "status-available"
                          : "status-unavailable"
                      }
                    >
                      <strong>{object.status}</strong>
                    </Card.Text>
                    {/* //REVIEW - need the implementation to edit item*/}
                    <Button className="button-edit">Edit</Button>
                    <Button
                      className="button-delete"
                      onClick={() => handleDelete(object.id)}
                    >
                      Delete
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })
        ) : (
          <p>No objects found.</p>
        )}
      </Row>
    </Container>
  );
};

export default MyObjects;
