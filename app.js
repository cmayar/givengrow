import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";

// import usersRouter from "./routes/users.js";
// import authRouter from "./routes/auth.js";
// import itemsRouter from "./routes/items.js";
import interactionsRouter from "./routes/interactions.js";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

// app.use("/api/users", usersRouter);
// app.use("/api/auth", authRouter);
// app.use("/api/items", itemsRouter);
app.use("/api/interactions", interactionsRouter);

// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

export default app;
