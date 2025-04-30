import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  adharNumber: {
    type: String,
    required: true, // ensure this is exactly 'adharNumber'
  },
  phone: String,
  address: Object,
  dob: String,
  gender: String,
  image: String,
});

const userModel = mongoose.model('User', userSchema);
export default userModel;
