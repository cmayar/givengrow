//(Handles user profile, updates)
import express from "express";
import loginUsers from "../middleware.js";
import pool from "../model/database.js";

const router = express.Router();

router.get("/profile", loginUsers, async (req, res) => {
  try {
    const [users] = await pool.query(
      "SELECT username, email FROM users WHERE id = ?",
      [req.user_id]
    );

    res.json(users[0]);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Error retrieving profile" });
  }
});

router.put("/profile", loginUsers, async (req, res) => {
  const { username, email } = req.body;

  try {
    await pool.query("UPDATE users SET username = ?, email = ? WHERE id = ?", [
      username,
      email,
      req.user_id,
    ]);

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Error updating profile" });
  }
});

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

export default router;
