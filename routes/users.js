//(Handles user profile, updates)
import express from "express";
import loginUsers from "../middleware.js";
import db from "../model/helper.js";

const router = express.Router();

//GET profile of logged-in user
router.get("/profile", loginUsers, async (req, res) => {
  try {
        // Fetch user data from the database based on the user_id from the JWT token
    const [users] = await db("SELECT username, email FROM users WHERE id = ?", [req.user_id]);
    console.log("Users Query Result:", users); // Log the raw response to see its structure
    
    //check if user was found
    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(users[0]);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Error retrieving profile" });
  }
});

router.put("/profile", loginUsers, async (req, res) => {
    const { username, email } = req.body;

  if (!username || !email) {
    return res.status(400).json({ message: "Username and email are required" });
  }

    try {
      //updates users profile
      await db("UPDATE users SET username = ?, email = ? WHERE id = ?", [
        username,
        email,
        req.user_id,
      ]);
  
      //responds with success message
      res.json({ message: "Profile updated successfully" });
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ message: "Error updating profile" });
    }
  });

export default router;
