import express from "express";
import morgan from "morgan";
import cors from "cors";
import animeRoutes from "./routes/anime.routes.js";
import { errorHandler } from "./middlewares/error.handler.js";
import AppError from "./utils/AppError.js";
import historyRoutes from "./routes/history.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

// Swagger UI imports
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path"; // Import path module
import { fileURLToPath } from 'url'; // Import fileURLToPath
import { dirname } from 'path'; // Import dirname

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Load Swagger YAML file
const swaggerSpec = YAML.load(path.resolve(__dirname, '../swagger.yaml')); // Corrected path

// Settings
app.set("port", process.env.PORT || 3000);
process.env.JWT_SECRET = 'your-secret-key';
process.env.JWT_EXPIRES_IN = '90d';

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to my anime API" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/animes", animeRoutes);
app.use("/api/users", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/history", historyRoutes);

// Handle undefined routes (404)
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error handling middleware
app.use(errorHandler);

export default app;
