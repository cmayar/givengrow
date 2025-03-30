import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getItems();
  }, []);

  useEffect(() => {
    console.log("Updated items state:", items);
  }, [items]);

  //Fetch all Items
  const getItems = async () => {
    try {
      console.log("Fetching items...");
      const response = await axios.get("http://localhost:4000/api/items/");

      console.log("Axios response:", response);

      if (response.status !== 200) {
        console.error("Error fetching items:", response.statusText);
        return;
      }

      const fetchedItems = response.data.data; // Axios automatically parses JSON
      console.log("Fetched items:", fetchedItems);
      setItems(fetchedItems);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  console.log("Items state:", items);

  return (
    <>
      <div>Home</div>
      <Link to="/profile" className="btn btn-outline-primary">
        Go to profile
      </Link>

      <div className="container mt-5">
        <h4>Shared objects</h4>
        <div className="row">
          {items.length > 0 ? (
            items.map((item) => (
              <div className="col-md-4 mb-3" key={item.id}>
                <div className="card p-3">
                  <h3>Title: {item.title}</h3>
                  <p>Item Description: {item.description}</p>
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
