import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useBadgeCounts } from "./BadgeCountsContext";

const Requests = () => {
  // Store the interactions where the user is the owner
  const [interactions, setInteractions] = useState([]);

  const { updateRequestsCount } = useBadgeCounts();

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

  // Fetch owner interactions from the API
  const fetchRequest = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = getUserId();

      const res = await axios.get(
        //owner 0 is a placeholder for the owner id
        `http://localhost:4000/api/interactions/owner/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setInteractions(res.data.interactions);

      // Filter for badge and count
      const requested = res.data.interactions.filter(
        ({ interaction }) => interaction.status === "requested"
      );
      updateRequestsCount(requested.length);
    } catch (error) {
      console.error("Error fetching interactions:", error);
    }
  };

  // Load the data when the component mounts, but need to refreh for new inractions
  // useEffect(() => {
  //   fetchInteractions();
  // }, []);

  // NOTE Auto update every 10 seconds
  useEffect(() => {
    fetchRequest();
    const interval = setInterval(() => {
      fetchRequest();
    }, 10000); // 10 seconds
    return () => clearInterval(interval); // Cleanup on unmount
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

      // Show success message
      toast.success("Request accepted successfully!");
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
