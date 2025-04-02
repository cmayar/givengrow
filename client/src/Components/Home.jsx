import React, { use } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// Home component displays shared items and filters them by category
const Home = () => {
  // State to store all fetched items
  const [items, setItems] = useState([]);

  // State to store selected category from dropdown
  const [selectedCategory, setSelectedCategory] = useState("");

  // Categories used for dropdown filter as per ENUM in DB
  const categories = [
    "tools",
    "outdoor",
    "kitchenware",
    "cleaning",
    "electronics",
    "sports",
    "furniture",
    "events",
    "childrens",
    "seasonal",
    "crafts",
    "media",
    "vehicles",
    "misc",
  ];

  // Fetch all items when the component mounts
  useEffect(() => {
    getItems();
  }, []);

  // Re-fetch items when selected category changes
  useEffect(() => {
    if (selectedCategory === "") {
      getItems(); // If no category selected, fetch all items
    } else {
      filteredByCategory(selectedCategory); // Otherwise, filter by selected category
    }
  }, [selectedCategory]);

  // Fetch all items form beckend
  const getItems = async () => {
    try {
      console.log("Fetching items...");
      const response = await axios.get("http://localhost:4000/api/items/");
      console.log("Axios response:", response);

      // Set items state or fallback to empty array to avoid crashes
      setItems(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching items:", error);
      setItems([]);
    }
  };

  // Fetch items filtered by category from backend
  const filteredByCategory = async (category) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/items/filter?key=category&value=${category}`
      );
      console.log("Filtered response:", response.data);
      setItems(response.data || []);
    } catch (error) {
      console.error("Error filtering items:", error);
      setItems([]);
    }
  };

  return (
    <>
      {/* Page heading */}
      <div>Home</div>
      <Link to="/profile" className="btn btn-outline-primary">
        Go to profile
      </Link>

      {/* Category dropdown filter */}
      <div>
        <label htmlFor="categoryFilter" className="form-label">
          Filter by category:
        </label>
        <select
          id="categoryFilter"
          className="form-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {/* Option to show all items */}
          <option value="">All categories</option>

          {/* Loop through categories to build dropdown options */}
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* List of shared objects */}
      <div className="container mt-5">
        <h4>Shared objects</h4>

        {/* Show cards if items exist */}
        <div className="row">
          {items.length > 0 ? (
            items.map((item) => (
              <div className="col-md-4 mb-3" key={item.id}>
                <div className="card p-3">
                  <h3>{item.title}</h3>
                  <p>Description: {item.description}</p>
                  <p>Category: {item.category}</p>
                  <p>Status: {item.status}</p>
                  <Link
                    to={`/items/${item.id}`}
                    className="btn btn-primary mt-2"
                  >
                    View Item
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>No items available</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
