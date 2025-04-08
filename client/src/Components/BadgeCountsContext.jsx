import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

// Create context
const BadgeCountsContext = createContext();

// Provider component
export const BadgeCountsProvider = ({ children }) => {
  // State to hold badge counts
  const [requestsCount, setRequestsCount] = useState(0);
  const [borrowedCount, setBorrowedCount] = useState(0);

  // Use isSignedIn state from AuthContext
  const { isSignedIn } = useAuth();

  // Function to get user ID from localStorage safely
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
  // Fetch badge counts, borrowed items, and requests based on user sign-in
  const fetchBadgeCounts = async () => {
    if (!isSignedIn) {
      console.log("User not signed in, cannot fetch badge counts.");
      return;
    }

    const token = localStorage.getItem("token");
    const userId = getUserId();

    if (!userId) {
      console.error("No valid user ID found, cannot fetch badge counts.");
      return;
    }

    try {
      const [ownerRes, borrowerRes] = await Promise.all([
        axios.get(`http://localhost:4000/api/interactions/owner/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`http://localhost:4000/api/interactions/borrower/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      //NOTE newer code
      // Add fallbacks in case data is missing
      const ownerData = ownerRes.data?.interactions || [];
      const borrowerData = borrowerRes.data?.interactions || [];

      // Count requested interactions for the owner
      const requests = ownerData.filter(
        (item) => item?.interaction?.status === "requested"
      );
      setRequestsCount(requests.length);

      // Count borrowed items that need to be returned by the borrower
      const borrowerItems = borrowerData.filter(
        (item) => item?.interaction?.status === "borrowed"
      );

      // Count returned items that the owner needs to confirm
      const returnsToConfirm = ownerData.filter(
        (item) => item?.interaction?.status === "borrower-returned"
      );

      // Sum both for the borrowed badge
      setBorrowedCount(borrowerItems.length + returnsToConfirm.length);
    } catch (error) {
      console.error("Error fetching badge counts:", error);
    }
  };

  // Set up polling to fetch badge counts every 10 seconds
  useEffect(() => {
    if (isSignedIn) {
      fetchBadgeCounts();
      const interval = setInterval(fetchBadgeCounts, 10000); // Every 10 seconds
      return () => clearInterval(interval);
    }
  }, [isSignedIn]);

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
