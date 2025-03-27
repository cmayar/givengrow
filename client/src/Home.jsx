import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";


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
    <><div>Home</div><div>
          <div>Shared objects</div>
          <ul>
  {items.length > 0 ? (
    items.map((item) => (
      <li key={item.id}>
        <h3>Title: {item.title}</h3>
        <p>Item Description: {item.description}</p>
        <p>Category: {item.category}</p>
        <p>Status: {item.status}</p>
      </li>
    ))
  ) : (
    <p>No items available</p>
  )}
</ul>
      </div></>
  )
}

export default Home