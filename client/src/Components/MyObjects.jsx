import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";

// NOTE: Fetching owned items

const MyObjects = () => {
  const [ownedItems, setOwnedItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOwnedItems = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found");
          return;
        }

        // Fetch items owned by the logged-in user
    //     const res = await axios.get("http://localhost:4000/api", {
    //       headers: { Authorization: `Bearer ${token}` },
    //     });

    //     setOwnedItems(res.data.ownedItems);
    //   } catch (err) {
    //     setError("Error fetching owned items");
    //   }
    // };

    fetchOwnedItems();
  }, []);

  return (
    <div className="container mt-4">
      <h3>Items You Own</h3>
      {error && <p className="text-danger">{error}</p>}
      <div className="row">
        {ownedItems.map((item) => (
          <div className="col-md-4 mb-3" key={item.id}>
            <div className="card p-3">
              <h5>{item.title}</h5>
              <p>{item.description}</p>
              <p>Category: {item.category}</p>
              <p>Status: {item.status}</p>
              {item.status === "borrowed" && (
                <button className="btn btn-primary">Accept Return</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyObjects;
