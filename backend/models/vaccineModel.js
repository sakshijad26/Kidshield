import mongoose from "mongoose";

const vaccineSchema = new mongoose.Schema({
    vaccineId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    ageGroup: { type: String, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true }, 
    doctorId: { type: String, required: true },
    doctorData: { type: Object, required: true },
    date: { type: Number, required: true },
}, { minimize: false });

const vaccineModel = mongoose.models.vaccine || mongoose.model("vaccine", vaccineSchema);
export default vaccineModel;