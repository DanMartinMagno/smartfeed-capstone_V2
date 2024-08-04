import mongoose, { Document, Schema, Types } from 'mongoose';

// Define the WeightEntry schema directly
const weightSchema = new Schema({
  date: { type: Date, default: Date.now },
  weight: { type: Number, required: true },
});

// Create the WeightEntry interface
interface WeightEntry extends Types.Subdocument {
  date: Date;
  weight: number;
}

// Define the main Swine schema
const swineSchema = new Schema({
  id: { type: String, required: true, unique: true },
  weight: { type: Number, required: true, min: 0 },
  age: { type: Number, required: true, min: 0 },
  date: { type: Date, default: Date.now },
  weights: { type: [weightSchema], default: [] }
});

// Create the Swine interface
interface ISwine extends Document {
  id: string;
  weight: number;
  age: number;
  date: Date;
  weights: Types.DocumentArray<WeightEntry>;
}

export default mongoose.model<ISwine>('Swine', swineSchema);
