import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

// Component to display borrowed items and manage the return flow
const Borrowed = () => {
  // Store the interactions where the user is the borrower
  const [borrowerInteractions, setBorrowerInteractions] = useState([]);

  // Store the interactions where the user is the owner
  const [ownerInteractions, setOwnerInteractions] = useState([]);

  // Store the success message to display to the user
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch both borrower and owner interactions from the API
  const fetchInteractions = async () => {
    try {
      const token = localStorage.getItem("token");

      // Get interactions where the user is the borrower
      const borrowerRes = await axios.get(
        //borrower 0 is a placeholder for the borrower id
        "http://localhost:4000/api/interactions/borrower/0",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Get interactions where the user is the owner
      const ownerRes = await axios.get(
        //owner 0 is a placeholder for the owner id
        "http://localhost:4000/api/interactions/owner/0",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Store the data in the state
      setBorrowerInteractions(borrowerRes.data.interactions);
      setOwnerInteractions(ownerRes.data.interactions);
    } catch (error) {
      console.error("Error fetching borrowed items:", error);
    }
  };

  // Load the data when the component mounts
  useEffect(() => {
    fetchInteractions();
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
      setSuccessMessage(
        "Item marked as returned! Awaiting owner confirmation."
      );

      // Refresh data
      fetchInteractions();
    } catch (error) {
      console.error("Error accepting request:", error);
      setSuccessMessage("Something went wrong. Please try again.");
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
      setSuccessMessage("Return confirmed. Item is now available.");

      // Refresh data
      fetchInteractions();
    } catch (error) {
      console.error("Error accepting request:", error);
      setSuccessMessage("Something went wrong. Please try again.");
    }
  };

  // Filter borrower-side interactions with status 'borrowed'
  const borrowedItems = borrowerInteractions.filter(
    ({ interaction }) => interaction.status === "borrowed"
  );

  // Filter owner-side interactions with status 'borrower-returned'
  const ownerReturnedItems = ownerInteractions.filter(
    ({ interaction }) => interaction.status === "borrower-returned"
  );

  return (
    <div className="container mt-5">
      <h2>Borrowed Items</h2>

      {/* Success message shown after actions */}
      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}

      {/* Section: Items currently borrowed by the user */}
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

      {/* Divider */}
      <hr className="my-5" />

      {/* Section: Items borrowed from the user that need confirmation */}
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
