import express from "express";
import db from "../model/helper.js";
import dotenv from "dotenv";
import loginUsers from "../middleware.js";
import multer from "multer";
// const upload = multer({ dest: 'public/img/' });
dotenv.config();

const router = express.Router();

// GET all Items
router.get("/", async (req, res) => {
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

// Filter Items
router.get("/filter", async (req, res) => {
  const { key, value } = req.query;
  let url = "SELECT * FROM items";
  if (key && value) {
    url += ` WHERE ${key} = '${value}'`;
  }
  try {
    const results = await db(url);
    res.status(200).send(results.data);
  } catch (error) {
    console.error("Error filtering items", error);
    res.status(500).send({ message: "Error filtering items" });
  }
});

// Get User's Items
router.get("/my-objects", loginUsers, async (req, res) => {
  const owner_id = req.user_id;
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
    if (result.length === 0) {
      return res.status(404).send({ error: "Item not found" });
    }
    res.status(200).send(result);
  } catch (err) {
    console.error("Error fetching user's objects:", err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Get Item by ID
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
    const result = await db(query, [id]);
    if (result.data.length === 0) {
      return res.status(404).send({ error: "Item not found" });
    }
    res.status(200).send(result.data[0]);
  } catch (err) {
    console.error("Error fetching item:", err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Create a new Item (protected)
router.post("/", loginUsers, async (req, res) => {
  const { title, image, description, category, status, latitude, longitude } =
    req.body;
  const owner_id = req.user_id;

  if (!title || !description || !category || !status) {
    return res.status(400).send({ message: "Missing required information" });
  }

  try {
    const result = await db(
      `INSERT INTO items (title, image, description, category, owner_id, status, latitude, longitude)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        image ?? null,
        description,
        category,
        owner_id,
        status,
        latitude ?? null,
        longitude ?? null,
      ]
    );

    const newItemId = result.insertId;

    const allItems = await db(`SELECT * FROM items`);
    res.send(allItems.data);
  } catch (err) {
    console.error("Error creating item:", err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Update an Item (protected)
router.put("/:id", loginUsers, async (req, res) => {
  const { id } = req.params;
  const { title, image, description, category, latitude, longitude } = req.body;
  const owner_id = req.user_id;

  if (!title || !description || !category) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const updatedItems = `
      UPDATE items
      SET title = ?, image = ?, description = ?, category = ?, owner_id = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?;
    `;

    const result = await db(updatedItems, [
      title,
      image,
      description,
      category,
      owner_id,
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

// Delete an Item (protected)
router.delete("/:id", loginUsers, async (req, res) => {
  const { id } = req.params;
  const owner_id = req.user_id;

  try {
    const item = await db(
      "SELECT * FROM items WHERE id = ? AND owner_id = ?;",
      [id, owner_id]
    );

    if (item.length === 0) {
      return res
        .status(404)
        .json({ error: "Item not found or does not belong to the user" });
    }

    await db("DELETE FROM items WHERE id = ? AND owner_id = ?;", [
      id,
      owner_id,
    ]);
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
