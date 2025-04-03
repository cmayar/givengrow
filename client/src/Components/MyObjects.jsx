import React,  { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Container, Row, Col } from "react-bootstrap";

const MyObjects = () => {
    const [objects, setObjects] = useState([]); //store the objects

    useEffect(() => {
        console.log("MyObjects component rendered");
        fetchMyObjects();
    }, []);

    const fetchMyObjects = async () => {
        try {
            const token = localStorage.getItem("token");  //get token form loged user
            const response = await axios.get("http://localhost:4000/api/items/my-objects", {
                headers: {
                  Authorization: `Bearer ${token}`, // send token to header
                },
              });
              setObjects(response.data); //save objects on the state
        } catch (err) {
            console.error("Error fetching user's objects:", err);
            console.log("Error fetching user's objects", err.response);
        }
    };

    return (
        <Container className="mt-4">
        <Row>
        {objects.length > 0 ? (
          objects.map((object) => (
            <Col md={4} sm={6} xs={12} key={object.id} className="mb-4">
              <Card>
                <Card.Img
                  variant="top"
                  src={object.image ? object.image : "/default-image.png"}
                  alt={object.title}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>{object.title}</Card.Title>
                  <Card.Text>{object.description}</Card.Text>
                  <Card.Text>
                    <strong>Category:</strong> {object.category}
                  </Card.Text>
                  <Card.Text>
                    <strong>Status:</strong>{" "}
                    <span
                      style={{
                        color: object.status === "available" ? "green" : "red",
                      }}
                    >
                      {object.status}
                    </span>
                  </Card.Text>
                  <Button variant="primary">Edit</Button>
                </Card.Body>
                </Card>
            </Col>
          ))
        ) : (
          <p>No objects found.</p>
        )}
      </Row>
        </Container>
    );
};

export default MyObjects;