//(JWT Authentication Middleware)

import jwt from "jsonwebtoken";
import { promisify } from "util";

const supersecret = process.env.SUPER_SECRET || "fallback_secret";

const loginUsers = async (req, res, next) => {
  console.log("HELLO FROM THE MIDDLEWARE");

  const token = req.headers.authorization?.replace(/^Bearer\s/, "");
  if (!token) {
    return res.status(401).json({ message: "Please provide a token" });
  }

  try {
    const decoded = await promisify(jwt.verify)(token, supersecret);
    req.user_id = decoded.user_id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default loginUsers;