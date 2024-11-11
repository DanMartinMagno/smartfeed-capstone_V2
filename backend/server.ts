// server.ts
import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database";
import routes from "./routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());

// CORS setup (you can restrict origins if necessary)
app.use(cors());

app.use(
  cors({
    origin: "*", // Allow all origins. You can restrict this to specific domains in production.
  })
);

// Routes
app.use("/api", routes);

// Basic route to check if server is up
app.get("/", (req: Request, res: Response) => {
  res.send("API is running...");
});

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
