import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import "./how.css";
import registerImg from "../assets/images/perfil-del-usuario.png";
import uploadImg from "../assets/images/cloud-upload-alt.png";
import confirmImg from "../assets/images/confirmacion.png";
import requestImg from "../assets/images/taladro-de-mano.png";

const How = () => {
  return (
    <Container className="how-container">
      <Row>
        <Col md={3} sm={6} xs={12} className="how-column">
          <Image src={registerImg} alt="Register" className="how-image" />
          <p>
            <strong>Register</strong>
          </p>
        </Col>
        <Col md={3} sm={6} xs={12} className="how-column">
          <Image src={uploadImg} alt="Upload" className="how-image" />
          <p>
            <strong>Upload</strong> all the objects you want to share
          </p>
        </Col>
        <Col md={3} sm={6} xs={12} className="how-column">
          <Image src={requestImg} alt="Request" className="how-image" />
         <strong> Need something? </strong> Send a request to another user and wait for their
          confirmation.
        </Col>
        <Col md={3} sm={6} xs={12} className="how-column">
          <Image src={confirmImg} alt="confirm" className="how-image" />
          <p>
            Send and accept requests. Manage Everything in Your{" "}
            <strong>Dashboard</strong>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default How;
