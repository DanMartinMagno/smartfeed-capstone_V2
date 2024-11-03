// backend/models/user.ts
import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  lastName: string;
  firstName: string;
  middleInitial: string;
  email: string;
  password: string;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  formulations: mongoose.Schema.Types.ObjectId[];
}

const UserSchema = new mongoose.Schema<IUser>({
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  middleInitial: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  formulations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Formulation" }],
});

// Hash password before saving to database
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash if modified
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare stored password hash with candidate password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  //console.log("Candidate password:", candidatePassword); // Input password for comparison
  //console.log("Stored hashed password:", this.password); // Hashed password in DB

  const match = await bcrypt.compare(candidatePassword, this.password);
  // console.log("Password comparison result:", match); // Logs true if passwords match
  return match;
};

export default mongoose.model<IUser>("User", UserSchema);
