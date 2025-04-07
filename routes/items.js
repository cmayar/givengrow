import express from "express";
import db from "../model/helper.js";
import dotenv from "dotenv";
import loginUsers from "../middleware.js";

dotenv.config();

const router = express.Router();

// //GET all Items
router.get("/", async (req, res) => {
  //NOTE - I change this endpoint to use the join to access to username of the owner.
  try {
    const query = `
      SELECT 
        items.*, 
        users.username AS owner_name 
      FROM items 
      JOIN users ON items.owner_id = users.id;
    `;
    const result = await db(query);
    res.status(200).send(result);
  } catch (err) {
    console.error("Error fetching items", err);
    res.status(500).send({ message: "Error fetching items" });
  }
});

//FILTER BY SOMETHING
//if I dont have any query parameters, I want to return all the items
// (("SELECT * FROM items;"))
//if I have a query parameter, I want to return the items that match the query parameter
// ("SELECT * FROM items WHERE title = 'Tent';")
// ("SELECT * FROM items WHERE catergory = 'outdoor';")

router.get("/filter", async (req, res) => {
  console.log("REQ.QUERY", req.query);

  const { key, value } = req.query;
  let url = "SELECT * FROM items";
  if (key && value) {
    url += ` WHERE ${key} = '${value}'`;
  }
  console.log("URL", url);
  try {
    const results = await db(url);
    res.status(200).send(results.data);
  } catch (error) {
    console.log(error);
  }
  // NOTE: This is the same as res.status(200).send(results.data) in the try block
  // res.send(results)
});

//TODO - New endpoint to get the objects of login user. It user the owner_id of the loged user.
router.get("/my-objects", loginUsers, async (req, res) => {
  const owner_id = req.user_id; // Obtenemos el ID del usuario autenticado
  console.log("Owner ID:", owner_id); 
  try {
    const query = `
      SELECT 
        items.*, 
        users.username AS owner_name 
      FROM items 
      JOIN users ON items.owner_id = users.id
      WHERE items.owner_id = ?;
    `;
    const result = await db(query, [owner_id]);
    console.log("Query Result:", result);
    if (result.length === 0) {
      return res.status(404).send({ error: "Item not found" });
    }
    res.status(200).send(result); 
    // console.log("Owner ID:", owner_id);
    // console.log("Query result:", result);

  } catch (err) {
    console.error("Error fetching user's objects:", err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// GET by user_id
  //NOTE - I change this endpoint to use the join to access to username of the owner.
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT 
        items.*, 
        users.username AS owner_name 
      FROM items 
      JOIN users ON items.owner_id = users.id
      WHERE items.id = ?;
    `;
    // console.log("Executing query:", query, "with id:", id);
    const result = await db(query, [id]);
    // console.log("Query result:", result); 

    if (result.data.length === 0) {
      return res.status(404).send({ error: "Item not found" });
    }
    // console.log("Sending response", result.data[0]);
    res.status(200).send(result.data[0]); // Send the first item
  } catch (err) {
    console.error("Error fetching item:", err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Create a new Item (protected)
router.post("/", loginUsers, async (req, res) => {
  const {
    title,
    image,
    description,
    category,
    // owner_id, remove owner_id from here
    status,
    latitude,
    longitude,
  } = req.body;

  const owner_id = req.user_id; //added here

  if (!title || !image || !description || !category || !owner_id || !status) {
    return res.status(400).send({ message: "Missing required information" });
  }

  try {
    await db(
      `INSERT INTO items (title, image, description, category, owner_id, status, latitude, longitude)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        image,
        description,
        category,
        owner_id,
        status,
        latitude ?? null, // NOTE replace with null if undefined
        longitude ?? null, // NOTE replace with null if undefined
      ]
    );
    const result = await db(`SELECT * FROM items`);
    res.send(result.data);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

//UPDATE ITEMS INFO (protected)
router.put("/:id", loginUsers, async (req, res) => {
  const { id } = req.params;
  const { title, image, description, category, latitude, longitude } =
    req.body;

    const owner_id = req.user_id;
  try {
    const itemsCheck = await db("SELECT id FROM items WHERE id = ?;", [id]);
    if (itemsCheck.data.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    if (!title || !image || !description || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const updatedItems = `
    UPDATE items
    SET title = ?, image = ?, description = ?, category = ?, owner_id = ?, status = ?, latitude = ?, longitude = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?;
  `;

    const result = await db(updatedItems, [
      title,
      image,
      description,
      category,
      owner_id,
      latitude,
      longitude,
      id,
    ]);

    if (result.data.length === 0) {
      return res.status(400).json({ error: "Failed to update item" });
    }

    res.status(200).json({ message: "Item updated successfully" });
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE ITEM (protected)
router.delete("/:id", loginUsers, async (req, res) => {
  const { id } = req.params;
  const owner_id = req.user_id; // Get the authenticated user's ID from the middleware

  try {
    // Check if the item exists and belongs to the user
    const item = await db("SELECT * FROM items WHERE id = ? AND owner_id = ?;", [id, owner_id]);

    if (item.length === 0) {
      return res
        .status(404)
        .json({ error: "Item not found or does not belong to the user" });
    }

    // Delete the item
    await db("DELETE FROM items WHERE id = ? AND owner_id = ?;", [id, owner_id]);

    res.status(200).json({
      message: "Item deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
