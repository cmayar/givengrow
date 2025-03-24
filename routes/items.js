import express from "express";
import db from '../model/helper.js';

const router = express.Router();

//GET all Items
router.get("/", async (req, res) => {
  try {
    const result = await db(`SELECT * FROM items`);
    res.status(200).send(result);
  }catch (err) {
    console.error("Error fetching items", err);
      res.status(500).send({ message: "Error fetching items"});
  }
})

// GET by user id
router.get("/:id", async (req, res ) => {
  const { id } = req.params;

  try {
    const result = await db(`SELECT * FROM items WHERE id = ${id};`);

    if (result.length === 0) {
      return res.status(404).send({ error: "Item not found" });
    }
    res.send(result.data);
  } catch (err) {
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// GET items by filtering
// filter by Category, Status or Owner (NOT WORKING)
// router.get("/filter", async (req, res) => {
//   console.log("Received request to /filter");
//   const { category, status, owner_id } = req.query; // we use req.query for the GET request. Ex. GET /items/filter?category=tools&status=available
//   console.log('Query parameters:', req.query); 
  
//   let query = "SELECT * FROM items WHERE 1=1"; // base query
//   const values = [];
  
//   // conditions based on the provided query params
//   if (category) {
//     query += " AND category = ? ";
//     values.push(category);
//   }
//   if (status) {
//     query += " AND status = ?";
//     values.push(status);
//   }
//   if (owner_id) {
//     query += " AND owner_id = ?";
//     values.push(owner_id);
//   }
  
//   try {
//     console.log('Executing query:', query);
//     console.log('With values:', values);

//     const result = await db(query, values);

//     if (result.length === 0) {
//       return res.status(404).send({ message: "No items found" });
//     }

//     res.status(200).send(result);

//   } catch (err) {
//     console.error("Error fetching filtered items", err);
//     res.status(500).send({ message: "Error fetching filtered items" });
//   }
// });



// Create a new Item
router.post("/", async (req, res) => {
  const { title, image, description, category, owner_id, status, latitude, longitude} = req.body;

  if (!title || !image || !description || !category || !owner_id || !status ) {
    return res.status(400).send({ message: "Missing required information" });
  }

try {
    await db(
    `INSERT INTO items (title, image, description, category, owner_id, status, latitude, longitude)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, image, description, category, owner_id, status, latitude, longitude]);
    const result =  await db(`SELECT * FROM items`);
    res.send(result.data);
} catch (err) {
  console.error(err);
  res.status(500).send({ error: "Internal Server Error" });
}
});


//UPDATE ITEMS STATUS
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["available", "unavailable"];

  if(status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid or missing status"});
  }

  try {
    const result = await db("SELECT * FROM items WHERE id = ?;", [id]);
    console.log("Query result:", result); 
    //check if item exists
    if (result.data.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
    await db("UPDATE items SET status = ? WHERE id = ?;", [status, id]);
    res.status(200).json({
      message: "Item status updated successfully"
    });
  } catch (err) {
    console.error("Error updating item status:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
})

//UPDATE ITEMS





// DELETE ITEM 
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
   const item = await db("SELECT * FROM items WHERE id = ?;", [id]);

  if (item.length === 0) {
    return res.status(404).json({ error: "Item not found or does not belong to the user" });
  }

  await db("DELETE FROM items WHERE id = ?;", [id]);

  res.status(200).json({
    message: "Item deleted successfully",
  });

} catch (err) {
  console.error("Error deleting item:", err);
  res.status(500).json({ error: "Internal Server Error" });
}
})





export default router;