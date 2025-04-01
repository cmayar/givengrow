import express from "express";
import db from "../model/helper.js";
import dotenv from "dotenv";
import loginUsers from "../middleware.js";

dotenv.config();

const router = express.Router();

// //GET all Items
router.get("/", async (req, res) => {
  try {
    const result = await db(`SELECT * FROM items`);
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

// router.get("/filter", async (req, res) => {
//   console.log('REQ.QUERY',req.query)

//   const { key, value } = req.query;
//   let url = "SELECT * FROM items";
//   if (key && value) {
//     url += ` WHERE ${key} = '${value}'`;
//   }
// console.log('URL',url)
//   try {
//     const results = await db(url);
//     res.status(200).send(results.data);

//   } catch (error) {
//     console.log(error);
//   }
//   // res.send(results)
// });

// GET by user_id

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db("SELECT * FROM items WHERE id = ?;", [id]);

    if (result.length === 0) {
      return res.status(404).send({ error: "Item not found" });
    }
    res.send(result.data);
  } catch (err) {
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// GET items by filtering
// filter by Category, Status or Owner




// Create a new Item
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

//UPDATE ITEMS STATUS --> Finally the status changes are managed in the interactions endpoints.
// router.put("/:id", async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;

//   const validStatuses = ["available", "unavailable"];

//   if(status && !validStatuses.includes(status)) {
//     return res.status(400).json({ error: "Invalid or missing status"});
//   }

//   try {
//     const result = await db("SELECT * FROM items WHERE id = ?;", [id]);
//     console.log("Query result:", result);
//     //check if item exists
//     if (result.data.length === 0) {
//       return res.status(404).json({ error: "Item not found" });
//     }
//     await db("UPDATE items SET status = ? WHERE id = ?;", [status, id]);
//     res.status(200).json({
//       message: "Item status updated successfully"
//     });
//   } catch (err) {
//     console.error("Error updating item status:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// })

//UPDATE ITEMS INFO
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, image, description, category, owner_id, latitude, longitude } =
    req.body;

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


// DELETE ITEM
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const item = await db("SELECT * FROM items WHERE id = ?;", [id]);

    if (item.length === 0) {
      return res
        .status(404)
        .json({ error: "Item not found or does not belong to the user" });
    }

    await db("DELETE FROM items WHERE id = ?;", [id]);

    res.status(200).json({
      message: "Item deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
