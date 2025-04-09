import React from "react";
import "./About.css";
import aboutImg from "../assets/images/about_image.png";
import earthImg from "../assets/images/tierra.png";
import confirmationImg from "../assets/images/confirmacion.png";
import { Image, Col, Row } from "react-bootstrap";




const About = () => {
  return (
    <div className="container mt-5 about-page">
         <Image
          src={aboutImg}
          alt="shareapp about image"
          fluid
          className="about-image mb-4"
        
        />
      <h2 className="title-style mb-1">
        Welcome to Give N Grow
      </h2>
      <h3 className="title-style mb-4">Your Community Sharing Platform!</h3>
      <p>
        This app helps people in your community lend and borrow items with ease
        – no money involved, just mutual trust and collaboration. Whether you
        have items to offer or need something for a short time, our platform
        makes sharing simple and organized.
      </p>

      <h4 className="mt-5">Why Sharing Matters</h4>
      <Row className="why-sharing-matters">
      <Col md={6}>
      <p>
        Every year, we waste billions of dollars on things we barely use. The
        average power drill is used for only 13 minutes in its lifetime, yet
        millions are sold annually. Overconsumption like this not only hits our
        wallets – it’s damaging our planet.
      </p>
      </Col>
      <Col md={6}>
      <ul>
        <li>
          The fashion and consumer goods industries contribute to over 60% of
          global greenhouse gas emissions from material use (UNEP, 2020).
        </li>
        <li>
          The average European throws away 16 kg of electronic waste per year
          (European Parliament, 2023).
        </li>
        <li>
          Landfills are overflowing with perfectly functional items,
          contributing to toxic pollution and methane emissions.
        </li>
      </ul>
      </Col>
      </Row>
<div className="highlighted-section">
      <p>
        By borrowing instead of buying, we reduce demand for manufacturing,
        lower emissions, and keep valuable materials in use longer. It’s a small
        change that makes a big difference.
      </p>
         <Image
          src={earthImg}
          alt="shareapp earth image"
          fluid
          className="earth-image mb-4"
        
        />
      <p>
        <strong>
          Let’s consume less and share more – for our planet, our wallets, and
          our communities.
        </strong>
      </p>
      </div>
      {/* how it works section */}
      <h4 className="mt-5">How It Works</h4>
      <Row className="how-it-works">
  <Col md={6}>
      <ol>
        <li>
          <strong>Sign Up / Log In:</strong> Create your account and log in to
          start sharing or borrowing.
        </li>
        <li>
          <strong>Explore Items:</strong> Browse all items shared by others on
          the homepage. Use the category filter to quickly find what you’re
          looking for.
        </li>
        <li>
          <strong>Request to Borrow:</strong> Found something useful? Click the
          item and send a borrow request to the owner.
        </li>
        </ol>  
        </Col>
        <Col md={6}>
        <ol start="4">
        <li>
          <strong>Manage Everything in Your Dashboard:</strong>
          <ul>
            <li>Post new items</li>
            <li>See your listed items</li>
            <li>Track items you’ve borrowed (with return options)</li>
            <li>Respond to requests from others</li>
          </ul>
        </li>
        <li>
          <strong>Borrow and Return with Ease:</strong>
          <ul>
            <li>
              As a borrower: click <em>Return Item</em> when you’re finished.
            </li>
            <li>
              As an owner: click <em>Confirm Return</em> when the item is back.
            </li>
          </ul>
        </li>
      </ol>
      </Col>
      </Row>

      <h4 className="mt-5">How to Post a New Item</h4>
      <Row className="how-to-post">
      <Col md={6}>
      <ol>
        <li>
        Go to your Dashboard and click <strong>Add Item</strong>.
        </li>
        <li>
          Fill in the item details:
          <ul>
            <li>Title (e.g., “Power Drill”, “Yoga Mat”)</li>
            <li>Upload an image</li>
            <li>Write a short description</li>
            <li>Choose a category</li>
            <li>Optionally, provide the location (latitude/longitude)</li>
          </ul>
        </li>
        </ol>
        </Col>
      <Col md={6}>
      <ol start="3">
        <li>
          Click <strong>Submit</strong> — and that’s it!
        </li>
        
      </ol>
      <Image
          src={confirmationImg}
          alt="shareapp earth image"
          fluid
          className="confirmation-image mb-4"
        
        />
    </Col>
  </Row>
    </div>
  );
};

export default About;
