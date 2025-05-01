import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { v2 as cloudinary } from 'cloudinary'
import stripe from "stripe";
import razorpay from 'razorpay';
import adharModel from "../models/adharModel.js"; // add this line
import vaccineModel from '../models/vaccineModel.js'
import vaccineRecordModel from '../models/vaccineRecordModel.js'; 


// Gateway Initialize
const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// API to register user
// API to register user
const registerUser = async (req, res) => {
    try {
      const { name, email, password, adharNumber } = req.body;
  
      // Validate required fields
      if (!name || !email || !password || !adharNumber) {
        return res.json({ success: false, message: 'Missing Details' });
      }
  
      // Validate email format
      if (!validator.isEmail(email)) {
        return res.json({ success: false, message: "Invalid email" });
      }
  
      // Validate password length
      if (password.length < 8) {
        return res.json({ success: false, message: "Password must be at least 8 characters" });
      }
  
      // ✅ Aadhaar verification (corrected field name: aadhaar)
      const adharExists = await adharModel.findOne({ aadhaar: adharNumber.trim() });
  
      if (!adharExists) {
        return res.json({ success: false, message: "Aadhaar not found in child database" });
      }
  
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create and save new user
      const newUser = new userModel({
        name,
        email,
        password: hashedPassword,
        adharNumber, // Keep this key if your userModel uses `adharNumber`
      });
  
      const user = await newUser.save();
  
      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  
      res.json({ success: true, token });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };
  
  


// API to login user
const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User does not exist" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user profile data
const getProfile = async (req, res) => {

    try {
        const { userId } = req.body
        const userData = await userModel.findById(userId).select('-password')

        res.json({ success: true, userData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update user profile
const updateProfile = async (req, res) => {

    try {

        const { userId, name, phone, address, dob, gender } = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" })
        }

        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })

        if (imageFile) {

            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, { image: imageURL })
        }

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to book appointment 
const bookAppointment = async (req, res) => {
    try {
        const { userId, docId, slotDate, slotTime, vaccineId } = req.body
        
        // Validate required fields
        if (!userId || !docId || !slotDate || !slotTime || !vaccineId) {
            return res.json({ success: false, message: 'Missing required fields' })
        }
        
        // Fetch doctor information
        const docData = await doctorModel.findById(docId).select("-password")
        
        if (!docData.available) {
            return res.json({ success: false, message: 'Doctor Not Available' })
        }
        
        // Fetch vaccine information
        const vaccineData = await vaccineModel.findById(vaccineId)
        
        if (!vaccineData) {
            return res.json({ success: false, message: 'Vaccine Not Found' })
        }
        
        if (vaccineData.stock <= 0) {
            return res.json({ success: false, message: 'Vaccine Out of Stock' })
        }
        
        let slots_booked = docData.slots_booked
        
        // checking for slot availability 
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot Not Available' })
            }
            else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }
        
        const userData = await userModel.findById(userId).select("-password")
        
        // Remove unnecessary data
        const cleanDocData = { ...docData.toObject() }
        delete cleanDocData.slots_booked
        
        // Total amount (doctor fees + vaccine price if applicable)
        const totalAmount = docData.fees + (vaccineData.price || 0)
        
        // Create appointment data
        const appointmentData = {
            userId,
            docId,
            userData,
            docData: cleanDocData,
            vaccineId: vaccineData._id,
            vaccineData: vaccineData,
            amount: totalAmount,
            slotTime,
            slotDate,
            date: Date.now()
        }
        
        // Save appointment
        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()
        
        // Update doctor's slots
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })
        
        // Reduce vaccine stock by 1
        await vaccineModel.findByIdAndUpdate(vaccineId, { $inc: { stock: -1 } })
        
        res.json({ success: true, message: 'Appointment Booked' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to cancel appointment
const cancelAppointment = async (req, res) => {
    try {

        const { userId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        // verify appointment user 
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        // releasing doctor slot 
        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
    try {

        const { userId } = req.body
        const appointments = await appointmentModel.find({ userId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


//Add this function to userController.js
const getVaccinesByDoctor = async (req, res) => {
    try {
        const { docId } = req.params
        
        // Fetch vaccines associated with the doctor
        const vaccines = await vaccineModel.find({ doctorId: docId })
        
        res.json({ 
            success: true, 
            vaccines 
        })
    } catch (error) {
        console.log(error)
        res.json({ 
            success: false, 
            message: error.message 
        })
    }
}

// API to make payment of appointment using razorpay
const paymentRazorpay = async (req, res) => {
    try {

        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' })
        }

        // creating options for razorpay payment
        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.CURRENCY,
            receipt: appointmentId,
        }

        // creation of an order
        const order = await razorpayInstance.orders.create(options)

        res.json({ success: true, order })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to verify payment of razorpay
const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if (orderInfo.status === 'paid') {
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true })
            res.json({ success: true, message: "Payment Successful" })
        }
        else {
            res.json({ success: false, message: 'Payment Failed' })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to make payment of appointment using Stripe
const paymentStripe = async (req, res) => {
    try {

        const { appointmentId } = req.body
        const { origin } = req.headers

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' })
        }

        const currency = process.env.CURRENCY.toLocaleLowerCase()

        const line_items = [{
            price_data: {
                currency,
                product_data: {
                    name: "Appointment Fees"
                },
                unit_amount: appointmentData.amount * 100
            },
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&appointmentId=${appointmentData._id}`,
            cancel_url: `${origin}/verify?success=false&appointmentId=${appointmentData._id}`,
            line_items: line_items,
            mode: 'payment',
        })

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const verifyStripe = async (req, res) => {
    try {

        const { appointmentId, success } = req.body

        if (success === "true") {
            await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true })
            return res.json({ success: true, message: 'Payment Successful' })
        }

        res.json({ success: false, message: 'Payment Failed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

const getChildData = async (req, res) => {
    try {
      const { userId } = req.body;
      const { childId } = req.params;
      
      // If childId is provided, fetch that specific child
      // Otherwise fetch the child associated with the user's Aadhaar
      const userData = await userModel.findById(userId).select('-password');
      
      if (!userData) {
        return res.json({ success: false, message: 'User not found' });
      }
      
      // Get child data from Aadhaar database or another source
      const childData = childId 
        ? await adharModel.findById(childId)
        : await adharModel.findOne({ aadhaar: userData.adharNumber });
      
      if (!childData) {
        return res.json({ success: false, message: 'Child data not found' });
      }
      
      res.json({ success: true, childData });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  }

  // In userController.js
const getVaccinationRecords = async (req, res) => {
    try {
      const { userId } = req.body;
      const { childId } = req.params;
      
      const userData = await userModel.findById(userId).select('-password');
      
      if (!userData) {
        return res.json({ success: false, message: 'User not found' });
      }
      
      // Query by childId if provided, otherwise by user's Aadhaar
      const query = childId 
        ? { childId }
        : { aadharNumber: userData.adharNumber };
      
      const records = await vaccineRecordModel.find(query).sort({ date: -1 });
      
      res.json({ success: true, records });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  }

export {
    loginUser,
    registerUser,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
    paymentRazorpay,
    verifyRazorpay,
    paymentStripe,
    getVaccinesByDoctor,
    getChildData,
    getVaccinationRecords,
    verifyStripe
}