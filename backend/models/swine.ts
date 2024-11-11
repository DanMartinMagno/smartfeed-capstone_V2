// backend/models/swine.ts

import mongoose, { Document, Schema, Types } from "mongoose";

const weightSchema = new Schema({
  date: { type: Date, default: Date.now },
  weight: { type: Number, required: true },
});

interface WeightEntry extends Types.Subdocument {
  date: Date;
  weight: number;
}

const swineSchema = new Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User association
  weight: { type: Number, required: true, min: 0 },
  age: { type: Number, required: true, min: 0 },
  date: { type: Date, default: Date.now },
  weights: { type: [weightSchema], default: [] },
});

interface ISwine extends Document {
  id: string;
  userId: Types.ObjectId;
  weight: number;
  age: number;
  date: Date;
  weights: Types.DocumentArray<WeightEntry>;
}

export default mongoose.model<ISwine>("Swine", swineSchema);
