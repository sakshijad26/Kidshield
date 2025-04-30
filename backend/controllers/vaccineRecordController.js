import vaccineRecordModel from "../models/vaccineRecordModel.js";
import adharModel from "../models/adharModel.js";
import vaccineModel from "../models/vaccineModel.js";
import doctorModel from "../models/doctorModel.js";

// Search child by Aadhaar number
export const searchChildByAadhar = async (req, res) => {
  try {
    const { aadharNumber } = req.body;

    if (!aadharNumber) {
      return res.status(400).json({
        success: false,
        message: "Aadhaar number is required"
      });
    }

    const child = await adharModel.findOne({ aadhaar: aadharNumber.trim() });

    if (!child) {
      return res.status(404).json({
        success: false,
        message: "Child not found with this Aadhaar number"
      });
    }

    const vaccinationHistory = await vaccineRecordModel
      .find({ aadharNumber: aadharNumber.trim() })
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      child,
      vaccinationHistory
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message
    });
  }
};

// Add new vaccination record
export const addVaccinationRecord = async (req, res) => {
    try {
      console.log("Request body:", req.body);
      
      const {
        aadharNumber,
        childId,
        childData,
        vaccineId,
        status,
        notes,
        appointmentId,
        docId  // Get docId from request body
      } = req.body;
  
      const doctorId = docId; // Use docId as doctorId
  
      if (!aadharNumber || !vaccineId || !childId || !doctorId) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields"
        });
      }
  
      const childExists = await adharModel.findOne({ aadhaar: aadharNumber.trim() });
      if (!childExists) {
        return res.status(404).json({
          success: false,
          message: "Child not found with this Aadhaar number"
        });
      }
  
      const vaccine = await vaccineModel.findById(vaccineId);
      if (!vaccine) {
        return res.status(404).json({
          success: false,
          message: "Vaccine not found"
        });
      }
  
      // Fetch doctor data
      const doctorData = await doctorModel.findById(doctorId).select('-password');
      if (!doctorData) {
        return res.status(404).json({
          success: false,
          message: "Doctor not found"
        });
      }
  
      const existingRecord = await vaccineRecordModel.findOne({
        aadharNumber: aadharNumber.trim(),
        vaccineId,
        status: { $in: ['scheduled', 'completed'] }
      });
  
      if (existingRecord) {
        return res.status(400).json({
          success: false,
          message: "This vaccination record already exists"
        });
      }
  
      const newRecord = new vaccineRecordModel({
        childId,
        aadharNumber: aadharNumber.trim(),
        childData: childData || childExists,
        doctorId,
        doctorData,
        vaccineId,
        vaccineData: vaccine,
        status: status || 'scheduled',
        appointmentId,
        date: Date.now(),
        completedDate: status === 'completed' ? Date.now() : null,
        notes
      });
  
      await newRecord.save();
  
      if (status === 'completed' && !appointmentId) {
        await vaccineModel.findByIdAndUpdate(vaccineId, { $inc: { stock: -1 } });
      }
  
      return res.status(201).json({
        success: true,
        message: "Vaccination record added successfully",
        record: newRecord
      });
    } catch (error) {
      console.error("Full error object:", error);
      return res.status(500).json({
        success: false,
        message: "Server error: " + error.message,
        stack: error.stack
      });
    }
  };

// Update vaccination status
export const updateVaccinationStatus = async (req, res) => {
  try {
    const { recordId, status, notes } = req.body;

    if (!recordId || !status) {
      return res.status(400).json({
        success: false,
        message: "Record ID and status are required"
      });
    }

    const record = await vaccineRecordModel.findById(recordId);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Vaccination record not found"
      });
    }

    if (record.doctorId !== req.body.doctorId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this record"
      });
    }

    const updateData = {
      status,
      notes: notes || record.notes
    };

    if (status === 'completed' && record.status !== 'completed') {
      updateData.completedDate = Date.now();

      if (!record.appointmentId) {
        await vaccineModel.findByIdAndUpdate(record.vaccineId, { $inc: { stock: -1 } });
      }
    }

    const updatedRecord = await vaccineRecordModel.findByIdAndUpdate(
      recordId,
      updateData,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Vaccination status updated successfully",
      record: updatedRecord
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message
    });
  }
};

// Get vaccination history for a child
export const getVaccinationHistory = async (req, res) => {
  try {
    const { aadharNumber } = req.params;

    if (!aadharNumber) {
      return res.status(400).json({
        success: false,
        message: "Aadhaar number is required"
      });
    }

    const history = await vaccineRecordModel
      .find({ aadharNumber: aadharNumber.trim() })
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      history
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message
    });
  }
};
