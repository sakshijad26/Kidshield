import mongoose from "mongoose";
import dotenv from "dotenv";
import Adhar from "../models/adharModel.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

const mockData = [
  {
    aadhaar: "123456789012",
    name: "Aryan Deshmukh",
    birthdate: "2020-03-15",
    age: 4,
    parentName: "Rajesh Deshmukh",
    location: "Mumbai"
  },
  {
    aadhaar: "987654321098",
    name: "Meera Patil",
    birthdate: "2019-10-10",
    age: 5,
    parentName: "Sneha Patil",
    location: "Pune"
  }
];

const seedAdharData = async () => {
  try {
    await connectDB();
    await Adhar.deleteMany(); // optional: clears old data
    await Adhar.insertMany(mockData); // <- fix this line!
    console.log("Adhar data seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Seeding Failed:", error);
    process.exit(1);
  }
};

seedAdharData();
