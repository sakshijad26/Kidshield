import mongoose from "mongoose";

const vaccineRecordSchema = new mongoose.Schema({
  childId: { type: String, required: true },
  aadharNumber: { type: String, required: true },
  childData: { type: Object, required: true },
  doctorId: { type: String, required: true },
  doctorData: { type: Object, required: true },
  vaccineId: { type: String, required: true },
  vaccineData: { type: Object, required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['scheduled', 'completed', 'missed'], 
    default: 'scheduled' 
  },
  appointmentId: { type: String }, // Optional, links to the appointment if exists
  date: { type: Number, required: true }, // Date record was created
  completedDate: { type: Number }, // Date when vaccination was completed
  notes: { type: String } // Optional notes from doctor
}, { timestamps: true });

// Create compound index for efficient querying
vaccineRecordSchema.index({ aadharNumber: 1, vaccineId: 1 });

const vaccineRecordModel = mongoose.models.vaccineRecord || mongoose.model("vaccineRecord", vaccineRecordSchema);
export default vaccineRecordModel;