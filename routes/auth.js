//(Handles login & registration)

// 1. Set up the environment and import necessary modules: 
// You import the packages you need to make the app work: express for the server, jwt for tokens, bcrypt for password security, and pool for database interaction.
//You use dotenv to manage sensitive information, like your secret key, safely.
import express from "express";  
import jwt from "jsonwebtoken";  
import bcrypt from "bcrypt"; 
import db from "../model/helper.js";  
import loginUsers from "../middleware.js";  
import dotenv from "dotenv";  

dotenv.config(); 

//Explanation: The saltRounds is how strong the password hashing will be.
// The supersecret is the secret key used for creating JWT tokens. You want this to be a secret that only your app knows.
const router = express.Router();  // Create a router to handle specific routes
const saltRounds = 10;  // Number of rounds for bcrypt hashing (more rounds = slower, but more secure)
const supersecret = process.env.SUPER_SECRET || "fallback_secret";  // Load the secret key from environment or use a default one

// 2. Register a new user
// Explanation:
// **When a new user wants to register, the server receives their username and password, hashes the password with bcrypt (to keep it secure), and saves the data in the database.
// **The server then responds with a success message (201 means "created successfully").
// **If anything goes wrong (like a database error), it sends a failure message (400 means "bad request").
router.post("/register", async (req, res) => {
  const { username, password, email, phonenumber } = req.body;  // Get username and password from the request body

  try {
    const hash = await bcrypt.hash(password, saltRounds);  // Hash the password and add saltRounds which is a random string, added to the end of your pw with x characters before hashing.
    await db (`INSERT INTO users (username, password, email, phonenumber) VALUES (?, ?, ?, ?)`, [username, hash, email, phonenumber]);  // Save the new user to the database

    res.status(201).send({ message: "Register successful" });  // Respond with success
  } catch (err) {
    res.status(400).send({ message: err.message });  // If something goes wrong, send an error
  }
});


// 🔹 Login user and generate JWT token
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const results = await db (`SELECT * FROM users WHERE username = ?`, [username]);
    const user = results.data[0];
console.log(results);
    if (!user) {
      return res.status(401).send({ message: "User does not exist" });
    }

    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
      return res.status(401).send({ message: "Incorrect password" });
    }

    const token = jwt.sign({ user_id: user.id }, supersecret, { expiresIn: "1h" });

    res.send({ message: "Login successful", token });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// 🔹 Get user profile (Protected Route)
router.get("/profile", loginUsers, async (req, res) => {
  try {
    const [result] = await pool.query(`SELECT username, id FROM users WHERE id = ?`, [req.user_id]);
    res.json(result[0]);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

export default router;