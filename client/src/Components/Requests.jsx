import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

const Requests = () => {
  // Store the interactions where the user is the owner
  const [interactions, setInteractions] = useState([]);

  // Store the success message to display to the user
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch owner interactions from the API
  const fetchRequest = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        //owner 0 is a placeholder for the owner id
        "http://localhost:4000/api/interactions/owner/0",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setInteractions(res.data.interactions);
    } catch (error) {
      console.error("Error fetching interactions:", error);
    }
  };

  // Load the data when the component mounts
  useEffect(() => {
    fetchRequest();
  }, []);

  // Hanlde the accept request
  const handleAccept = async (interactionId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:4000/api/interactions/${interactionId}/status`,
        {
          status: "requested",
          userType: "owner",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Notify the user that the request has been accepted
      setSuccessMessage("Request accepted successfully!");

      // Refetch data
      fetchRequest();
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  // Filter interactions with status 'requested'
  const requestedInteractions = interactions.filter(
    ({ interaction }) => interaction.status === "requested"
  );

  return (
    <div className="container mt-5">
      <h2>Incoming Requests</h2>

      {/* Success message */}
      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}

      {requestedInteractions.length === 0 ? (
        <p>No requests at the moment.</p>
      ) : (
        requestedInteractions.map(({ interaction }) => (
          <div key={interaction.id} className="card mb-3">
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
              onClick={() => handleAccept(interaction.id)}
            >
              Accept Request
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Requests;
