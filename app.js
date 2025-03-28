import express from "express";
//import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";

import users from "./routes/users.js";
import auth from "./routes/auth.js";

const app = express();

app.use('/auth', auth);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/api/users", users);
app.use("/api/auth", auth);

export default app;
