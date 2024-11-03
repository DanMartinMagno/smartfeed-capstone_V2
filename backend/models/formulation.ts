// models/formulation.ts

import mongoose, { Document, Schema } from "mongoose";

export interface IFormulation extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  name: string;
  description: string;
  type: "starter" | "grower" | "finisher";
  ingredients: { name: string; amount: number }[]; // Changed to 'ingredients'
  totalNutrients: {
    crudeProtein: number;
    crudeFiber: number;
    crudeFat: number;
    calcium: number;
    moisture: number;
    phosphorus: number;
  };
  createdAt: Date;
}

const FormulationSchema = new Schema<IFormulation>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ["starter", "grower", "finisher"],
  },
  ingredients: [
    // Updated field name to ingredients
    {
      name: { type: String, required: true },
      amount: { type: Number, required: true },
    },
  ],
  totalNutrients: {
    crudeProtein: { type: Number, required: true },
    crudeFiber: { type: Number, required: true },
    crudeFat: { type: Number, required: true },
    calcium: { type: Number, required: true },
    moisture: { type: Number, required: true },
    phosphorus: { type: Number, required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IFormulation>("Formulation", FormulationSchema);
