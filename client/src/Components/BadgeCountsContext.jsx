import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// Create context
const BadgeCountsContext = createContext();

// Provider component
export const BadgeCountsProvider = ({ children }) => {
  // State to hold badge counts
  const [requestsCount, setRequestsCount] = useState(0);
  const [borrowedCount, setBorrowedCount] = useState(0);

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
  // Function to fetch and update badge counts
  const fetchBadgeCounts = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = getUserId();

      const [ownerRes, borrowerRes] = await Promise.all([
        axios.get(`http://localhost:4000/api/interactions/owner/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`http://localhost:4000/api/interactions/borrower/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const ownerData = ownerRes.data.interactions;
      const borrowerData = borrowerRes.data.interactions;

      // Count requested interactions for the owner with filter
      const requests = ownerData.filter(
        ({ interaction }) => interaction.status === "requested"
      );
      setRequestsCount(requests.length);

      // Count borrowed items borrower needs to return
      const borrowerItems = borrowerData.filter(
        ({ interaction }) => interaction.status === "borrowed"
      );

      // Count returned items that the owner needs to confirm
      const returnsToConfirm = ownerData.filter(
        ({ interaction }) => interaction.status === "borrower-returned"
      );

      // Sum both for borrowed badge
      setBorrowedCount(borrowerItems.length + returnsToConfirm.length);
    } catch (error) {
      console.error("Error fetching badge counts:", error);
    }
  };

  // Set up polling
  useEffect(() => {
    fetchBadgeCounts();
    const interval = setInterval(fetchBadgeCounts, 10000); // Every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <BadgeCountsContext.Provider
      value={{
        requestsCount,
        borrowedCount,
        updateRequestsCount: setRequestsCount,
        updateBorrowedCount: setBorrowedCount,
      }}
    >
      {children}
    </BadgeCountsContext.Provider>
  );
};

// Custom hook to access the bade counts
export const useBadgeCounts = () => useContext(BadgeCountsContext);
