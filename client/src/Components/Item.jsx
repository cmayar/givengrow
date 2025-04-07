import React, { use } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Form, Image, Row, Col } from "react-bootstrap";
import "./item.css";
import "./styles.css";
import defaultImage from "../assets/images/default_image.png";
import { toast } from "react-toastify";

const formatDate = (date) => {
  if (!(date instanceof Date)) return "";
  return date.toISOString().split("T")[0];
};

const Item = () => {
  const { id } = useParams();
  const [item, setItem] = useState({});
  const [startDate, setStartDate] = useState(formatDate(new Date()));
  const [endDate, setEndDate] = useState(formatDate(new Date()));

  useEffect(() => {
    getItem();
  }, []);

  useEffect(() => {
    console.log("Updated item state:", item);
  }, [id]);

  const getItem = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/items/${id}`);
      console.log("Fetched item:", response.data);

      if (response.status !== 200) {
        console.error("Error fetching item:", response.statusText);
        return;
      }
      setItem(response.data); // Set the fetched item
    } catch (error) {
      console.error("Error fetching item:", error);
    }
  };

  // Request to borrow item
  // Rewrite this to use the token
  const requestItem = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `http://localhost:4000/api/interactions`,
        {
          item_id: parseInt(id),
          start_date: startDate,
          end_date: endDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Interaction response:", res.data);
      toast.success("Request submitted! The owner will review it soon.");
    } catch (err) {
      console.err("Error requesting item:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (!item) {
    return <p>Loading item details...</p>;
  }

  return (
    <div className="container mt-5">
    <Card className="mx-auto p-3" style={{ maxWidth: "800px" }}>
    <Row>
    <Col md={4} className="d-flex align-self-start">
    
      <Image
        variant="left"
        src={item.imageUrl || defaultImage}
        alt="Item Image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = defaultImage;
        }}
         className="img-fluid rounded"
      />
          </Col>
          <Col md={8}>
          
    <Card.Body>
          <Card.Title>{item.title}</Card.Title>
          <Card.Text>
            <strong>Description:</strong> {item.description}
          </Card.Text>
          <Card.Text>
            <strong>Category:</strong> {item.category}
          </Card.Text>
          <Card.Text
            className={
              item.status === "available"
                ? "status-available"
                : "status-unavailable"
            }
          >
          <strong> {item.status}</strong>
          </Card.Text>
          <Card.Text>
            <strong>Owner:</strong> {item.owner_name}
          </Card.Text>
          {/* Set date and request */}
          {item.status === "available" && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label><strong>Start Date</strong></Form.Label>
                <Form.Control
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label><strong>End Date</strong></Form.Label>
                <Form.Control
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Form.Group>
              <button className="button" onClick={requestItem}>
                Request to Borrow
              </button>
            </Form>
            
          )}
           <Link to="/home" className="custom-link">
            Back to Home
          </Link>
        </Card.Body>
        
        </Col>
        
        </Row>
      </Card>
    </div>
  );
};

export default Item;
