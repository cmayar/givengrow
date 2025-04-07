import express from "express";
//import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";

import auth from "./routes/auth.js"; //Import the auth routes

import interactionsRouter from "./routes/interactions.js";
import usersRouter from "./routes/users.js";
import itemsRouter from "./routes/items.js";
import imagesRouter from "./routes/images.js";

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public"));
//app.use(express.static(path.join(__dirname, "public")));

app.use("/api", auth); // Use the routes defined in auth.js under "/api"
app.use("/api/users", usersRouter);

app.use("/api/interactions", interactionsRouter);
app.use("/api/items", itemsRouter);
app.use("/api/images", imagesRouter);

export default app;
