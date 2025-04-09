import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Container, Row, Col, Image, Form } from "react-bootstrap";
import "./MyObject.css";
import "./Item.css";
import "./styles.css";
import defaultImage from "../assets/images/default_image.png";

const MyObjects = () => {
  const [objects, setObjects] = useState([]); // Store the objects
  const [editingObjectId, setEditingObjectId] = useState(null); // Track the object being edited
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: "",
  });

  useEffect(() => {
    fetchMyObjects();
  }, []);

  const fetchMyObjects = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:4000/api/items/my-objects",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setObjects(response.data.data);
    } catch (err) {
      console.error("Error fetching user's objects:", err);
    }
  };

  // handle edit funcionallity
  const handleEditClick = (object) => {
    setEditingObjectId(object.id); // Set the object being edited
    setFormData({
      title: object.title,
      description: object.description,
      category: object.category,
      image: object.image || defaultImage,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:4000/api/items/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the object in the state
      setObjects((prevObjects) =>
        prevObjects.map((object) =>
          object.id === id ? { ...object, ...formData } : object
        )
      );

      setEditingObjectId(null); // Exit edit mode
    } catch (err) {
      console.error("Error updating item:", err);
    }
  };

  const handleCancel = () => {
    setEditingObjectId(null); // Exit edit mode without saving
  };


  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:4000/api/items/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
          objects.map((object) => (
            <Col md={4} sm={6} xs={12} key={object.id}>
              <Card className="my-object-card p-3" border="0">
                <Card.Body>
                  <div className="card-img-container">
                    <Image
                      src={object.image || defaultImage}
                      alt="Item Image"
                      className="object-card-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultImage;
                      }}
                    />
                  </div>
                  {editingObjectId === object.id ? (
                    <>
                      <Form>
                        <Form.Group>
                          <Form.Label>Title</Form.Label>
                          <Form.Control
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Description</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Category</Form.Label>
                          <Form.Control
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Form>
                      <Button
                        className="edit-button"
                        onClick={() => handleSave(object.id)}
                      >
                        Save
                      </Button>
                      <Button
                        className="button-delete"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
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
                      <Button
                        className="edit-button"
                        onClick={() => handleEditClick(object)}
                      >
                        Edit
                      </Button>
                      <Button
                        className="button-delete"
                        onClick={() => handleDelete(object.id)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
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