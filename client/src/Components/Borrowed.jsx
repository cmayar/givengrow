import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useBadgeCounts } from "./BadgeCountsContext";
import { Card, Image } from "react-bootstrap";
import "./item.css";
import "./MyObject.css";
import "./borrowed.css";
import defaultImage from "../assets/images/default_image.png";

// Component to display borrowed items and manage the return flow
const Borrowed = () => {
  // Store the interactions where the user is the borrower
  const [borrowerInteractions, setBorrowerInteractions] = useState([]);

  // Store the interactions where the user is the owner
  const [ownerInteractions, setOwnerInteractions] = useState([]);

  const { updateBorrowedCount } = useBadgeCounts();

  // Helper to get user ID from localStorage

  const getUserId = () => {
    const userStr = localStorage.getItem("user");
    if (!userStr || userStr === "undefined") return null;

    try {
      const user = JSON.parse(userStr);
      return user?.id || null;
    } catch (err) {
      console.error("Failed to parse user from localStorage:", err);
      return null;
    }
  };

  // Fetch both borrower and owner interactions from the API
  const fetchInteractions = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = getUserId();
      // Get interactions where the user is the borrower
      const borrowerRes = await axios.get(
        //borrower 0 is a placeholder for the borrower id
        `http://localhost:4000/api/interactions/borrower/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Get interactions where the user is the owner
      const ownerRes = await axios.get(
        //owner 0 is a placeholder for the owner id
        `http://localhost:4000/api/interactions/owner/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Store the data in the state
      setBorrowerInteractions(borrowerRes.data.interactions);
      setOwnerInteractions(ownerRes.data.interactions);

      // Filter for badge and count
      const borrowedToReturn = borrowerRes.data.interactions.filter(
        ({ interaction }) => interaction.status === "borrowed"
      );
      const returnsToConfirm = ownerRes.data.interactions.filter(
        ({ interaction }) => interaction.status === "borrower-returned"
      );

      // Update badge count
      updateBorrowedCount(borrowedToReturn.length + returnsToConfirm.length);
    } catch (error) {
      console.error("Error fetching borrowed items:", error);
    }
  };

  // NOTE Auto update every 10 seconds
  useEffect(() => {
    fetchInteractions();

    const interval = setInterval(() => {
      fetchInteractions();
    }, 10000); // 10 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Called when the user returns an item
  const handleReturn = async (interactionId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:4000/api/interactions/${interactionId}/status`,
        {
          status: "borrowed", // will transition to 'borrower-returned' in backend
          userType: "borrower",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Notify the user that the item has been returned
      toast.success("Item marked as returned! Awaiting owner confirmation.");
      // Refresh data
      fetchInteractions();
    } catch (error) {
      console.error("Error accepting request:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  // Called when the owner confirms the item has been return
  const handleConfirmReturn = async (interactionId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:4000/api/interactions/${interactionId}/status`,
        {
          status: "borrower-returned",
          userType: "owner",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Notify the user that the item has been returned
      toast.success("Return confirmed. Item is now available.");
      // Refresh data
      fetchInteractions();
    } catch (error) {
      console.error("Error accepting request:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  // Filter borrower-side interactions with status 'borrowed'
  const borrowedItems = borrowerInteractions.filter(
    ({ interaction }) => interaction.status === "borrowed"
  );

  // Filter owner-side interactions with status 'borrowed' and 'borrower-returned'
  const ownerBorrowedItems = ownerInteractions.filter(
    ({ interaction }) =>
      interaction.status === "borrowed" ||
      interaction.status === "borrower-returned"
  );

  return (
    <div className="container mt-5">
      {/* Section: Items currently borrowed by the user */}
      <h4 className="title-style">Items You Borrowed</h4>
      {borrowedItems.length === 0 ? (
        <p>You haven't borrowed any items currently.</p>
      ) : (
        borrowedItems.map(({ interaction }) => (
          <Card
            key={interaction.id}
            className="card item-card-container mb-3 p-3"
          >
            <div className="item-img-container">
              <Image
                src={interaction.item.imageUrl || defaultImage}
                alt="Item Image"
                className="card-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultImage;
                }}
              />
            </div>
            <Card.Body>
              <Card.Title>{interaction.item.title}</Card.Title>
              <Card.Text>
                <strong>Owner:</strong> {interaction.owner.username}
              </Card.Text>
              <Card.Text>
                <strong>From:</strong> {interaction.dates.start}
              </Card.Text>
              <Card.Text>
                <strong>To:</strong> {interaction.dates.end}
              </Card.Text>
              <Card.Text>
                <strong>Status:</strong> {interaction.status}
              </Card.Text>
              <button
                className="button-success"
                onClick={() => handleReturn(interaction.id)}
              >
                Return Item
              </button>
            </Card.Body>
          </Card>
        ))
      )}

      {/* Divider */}
      <hr className="my-5" />

      {/* Section: Items borrowed from the user that need confirmation */}
      <h4 className="title-style">Items Borrowed From You</h4>
      {ownerBorrowedItems.length === 0 ? (
        <p>No one is currently borrowing your items.</p>
      ) : (
        ownerBorrowedItems.map(({ interaction }) => (
          <div
            key={interaction.id}
            className="card item-card-container mb-3 p-3"
          >
            <div className="item-img-container">
              <Image
                src={interaction.item.imageUrl || defaultImage}
                alt="Item Image"
                className="card-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultImage;
                }}
              />
            </div>
            <div className="card-body">
              <h5>{interaction.item.title}</h5>
              <p>
                <strong>Borrower:</strong> {interaction.borrower.username}
              </p>
              <p>
                <strong>From:</strong> {interaction.dates.start}
              </p>
              <p>
                <strong>To:</strong> {interaction.dates.end}
              </p>
              <p>
                <strong>Status:</strong> {interaction.status}
              </p>
              {/* <button
                className="btn btn-success"
                onClick={() => handleConfirmReturn(interaction.id)}
              >
                Confirm Return
              </button> */}
              {interaction.status === "borrower-returned" && (
                <button
                  className="btn btn-success"
                  onClick={() => handleConfirmReturn(interaction.id)}
                >
                  Confirm Return
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Borrowed;
