
import express from "express";
import morgan from "morgan";
import cors from "cors";
import animeRoutes from "./routes/anime.routes.js";
import { errorHandler } from "./middlewares/error.handler.js";
import AppError from "./utils/AppError.js";
import userRoutes from "./routes/user.routes.js";
import historyRoutes from "./routes/history.routes.js";

const app = express();

// Settings
app.set("port", process.env.PORT || 3000);

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to my anime API" });
});

app.use("/api/animes", animeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/history", historyRoutes);

// Handle undefined routes (404)
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error handling middleware
app.use(errorHandler);

export default app;
