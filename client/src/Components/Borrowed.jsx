import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

/*
  STILL DEVELOPING THIS COMPONENT
*/

const Borrowed = () => {
  const [interactions, setInteractions] = useState([]);

  const [successMessage, setSuccessMessage] = useState("");

  const fetchBorrowed = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        //owner 0 is a placeholder for the borrower id
        "http://localhost:4000/api/interactions/borrower/0",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      //NOTE - debug code
      console.log("API Response: ", res.data);
      setInteractions(res.data.interactions);
    } catch (error) {
      console.error("Error fetching borrowed items:", error);
    }
  };

  useEffect(() => {
    fetchBorrowed();
  }, []);

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

      fetchBorrowed(); // Refresh the list of interactions
    } catch (error) {
      console.error("Error accepting request:", error);
      setSuccessMessage("Something went wrong. Please try again.");
    }
  };

  const borrowedItems = interactions.filter(
    ({ interaction }) => interaction.status === "borrowed"
  );
  console.log("Borrowed Items: ", borrowedItems);

  return (
    <div className="container mt-5">
      <h2>Borrowed Items</h2>
      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}
      {borrowedItems.length === 0 ? (
        <p>You haven't borrowed any items currently.</p>
      ) : (
        borrowedItems.map(({ interaction }) => (
          <div key={interaction.id} className="card mb-3">
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
    </div>
  );
};

export default Borrowed;
