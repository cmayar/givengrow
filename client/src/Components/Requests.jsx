import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

const Requests = () => {
  const onwer_id = 1;
  const [interactions, setInteractions] = useState([]);

  const fetchRequest = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/interactions/${onwer_id}`
      );
      setInteractions(res.data.interactions);
    } catch (error) {
      console.error("Error fetching interactions:", error);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, []);

  const handleAccept = async (interaction_id, currentStatus) => {
    try {
      const res = await axios.put(
        `http://localhost:4000/api/interactions/${interactionId}/status`,
        {
          userType: "owner",
          status: currentStatus, // should be 'requested' for this action
        }
      );

      fetchRequest(); // Refresh the list of interactions
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Incoming Requests</h2>
    </div>
  );
};
