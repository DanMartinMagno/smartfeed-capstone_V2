import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import routes from "./routes";
import connectDB from "./config/database";

const app = express();

// Connect to the database
connectDB();

// Middleware setup
app.use(bodyParser.json());
app.use(cors());

// Load routes
app.use("/api", routes);

export default app;
