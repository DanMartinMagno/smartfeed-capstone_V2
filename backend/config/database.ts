import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.set("strictQuery", false); // Suppress the warning

const connectDB = async () => {
  try {
    // No need to pass 'useNewUrlParser' or 'useUnifiedTopology' anymore
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the process if unable to connect
  }
};

export default connectDB;
