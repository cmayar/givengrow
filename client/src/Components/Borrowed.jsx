import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

/*
  STILL DEVELOPING THIS COMPONENT
*/

const Borrowed = () => {
  // const [interactions, setInteractions] = useState([]);

  const [borrowerInteractions, setBorrowerInteractions] = useState([]);
  const [ownerInteractions, setOwnerInteractions] = useState([]);

  const [successMessage, setSuccessMessage] = useState("");

  const fetchInteractions = async () => {
    try {
      const token = localStorage.getItem("token");

      const borrowerRes = await axios.get(
        //owner 0 is a placeholder for the borrower id
        "http://localhost:4000/api/interactions/borrower/0",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const ownerRes = await axios.get(
        //owner 0 is a placeholder for the owner id
        "http://localhost:4000/api/interactions/owner/0",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBorrowerInteractions(borrowerRes.data.interactions);
      setOwnerInteractions(ownerRes.data.interactions);
    } catch (error) {
      console.error("Error fetching borrowed items:", error);
    }
  };

  useEffect(() => {
    fetchInteractions();
  }, []);

  // Borrower returns the item
  const handleReturn = async (interactionId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:4000/api/interactions/${interactionId}/status`,
        {
          status: "borrowed",
          userType: "borrower",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Notify the user that the item has been returned
      setSuccessMessage(
        "Item marked as returned! Awaiting owner confirmation."
      );

      fetchInteractions(); // Refresh the list of interactions
    } catch (error) {
      console.error("Error accepting request:", error);
      setSuccessMessage("Something went wrong. Please try again.");
    }
  };

  // Owner confirms the item has been returned
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

      setSuccessMessage("Return confirmed. Item is now available.");
      fetchInteractions(); // Refresh the list of interactions
    } catch (error) {
      console.error("Error accepting request:", error);
      setSuccessMessage("Something went wrong. Please try again.");
    }
  };

  // filter out the borrowed items
  const borrowedItems = borrowerInteractions.filter(
    ({ interaction }) => interaction.status === "borrowed"
  );

  const ownerReturnedItems = ownerInteractions.filter(
    ({ interaction }) => interaction.status === "borrower-returned"
  );

  return (
    <div className="container mt-5">
      <h2>Borrowed Items</h2>

      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}

      <h4>Items You Borrowed</h4>
      {borrowedItems.length === 0 ? (
        <p>You haven't borrowed any items currently.</p>
      ) : (
        borrowedItems.map(({ interaction }) => (
          <div key={interaction.id} className="card mb-3 p-3">
            <h5>{interaction.item.title}</h5>
            <p>
              <strong>Owner:</strong> {interaction.owner.username}
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
            <button
              className="btn btn-success"
              onClick={() => handleReturn(interaction.id)}
            >
              Return Item
            </button>
          </div>
        ))
      )}

      <hr className="my-5" />

      <h4>Items Borrowed From You</h4>
      {ownerReturnedItems.length === 0 ? (
        <p>No items are awaiting your return confirmation.</p>
      ) : (
        ownerReturnedItems.map(({ interaction }) => (
          <div key={interaction.id} className="card mb-3 p-3">
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
            <button
              className="btn btn-success"
              onClick={() => handleConfirmReturn(interaction.id)}
            >
              Confirm Return
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Borrowed;
