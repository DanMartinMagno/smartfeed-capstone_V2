import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import routes from "./routes";

const app = express();

app.use(bodyParser.json());
app.use(cors()); // Enable CORS
app.use("/api", routes);

export default app;
