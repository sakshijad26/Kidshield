import mongoose from 'mongoose';

const aadhaarSchema = new mongoose.Schema({
  aadhaar: { type: String, required: true, unique: true },
  name: String,
  dob: String,
  age: Number,
  parentName: String,
  location: String
});

const aadhaarModel = mongoose.models.aadhaar || mongoose.model("aadhaar", aadhaarSchema);
export default aadhaarModel;
