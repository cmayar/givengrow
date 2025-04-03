import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";

import auth from "./routes/auth.js";

import interactionsRouter from "./routes/interactions.js";
import usersRouter from "./routes/users.js";
import itemsRouter from "./routes/items.js";
import imagesRouter from "./routes/images.js";

const __dirname = path.resolve();

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/auth", auth);

app.use("/api/interactions", interactionsRouter);
app.use("/", usersRouter);
app.use("/api/items", itemsRouter);
app.use("/api/images", imagesRouter);

export default app;
