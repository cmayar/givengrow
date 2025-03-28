import express from "express";
//import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";

import interactionsRouter from "./routes/interactions.js";
import usersRouter from "./routes/users.js";
import itemsRouter from "./routes/items.js";

const app = express();

app.use('/auth', auth);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/api/interactions", interactionsRouter);
app.use("/", usersRouter);
app.use("/api/items", itemsRouter);

export default app;
