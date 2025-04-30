// models/Vaccine.js
import mongoose from "mongoose";

const vaccineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  type: { type: String }, // Live, Inactivated, Combination
  ageRequired: { type: String }, // e.g., 'At birth', '6 weeks'
  stock: { type: Number, default: 0 },
});

export default mongoose.model("Vaccine", vaccineSchema);
