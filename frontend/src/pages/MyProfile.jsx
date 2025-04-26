import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyProfile = () => {
  const { token, userData, setUserData, loadUserProfileData, backendUrl } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const handleProfileUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('userId', userData._id); // optional if using token for auth
      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      formData.append('dob', userData.dob);
      formData.append('gender', userData.gender);
      formData.append('address', JSON.stringify(userData.address));
      if (imageFile) formData.append('image', imageFile);

      const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, formData, {
        headers: {
          token,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (data.success) {
        toast.success('Profile updated!');
        setIsEdit(false);
        loadUserProfileData(); // reload updated data
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update profile');
    }
  };

  useEffect(() => {
    if (token) loadUserProfileData();
  }, [token]);

  return userData && (
    <div className='flex flex-col gap-4 m-5'>
      <div>
        <img
          className='bg-primary/80 w-full sm:max-w-64 rounded-lg'
          src={imageFile ? URL.createObjectURL(imageFile) : userData.image}
          alt="User Profile"
        />
        {isEdit && (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className='mt-2'
          />
        )}
      </div>

      <div className='flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white'>

        <div className='flex flex-col gap-2'>
          <label>Full Name:</label>
          {isEdit
            ? <input type="text" value={userData.name} onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))} />
            : <p>{userData.name}</p>}
        </div>

        <div className='flex flex-col gap-2 mt-3'>
          <label>Phone:</label>
          {isEdit
            ? <input type="tel" value={userData.phone} onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))} />
            : <p>{userData.phone}</p>}
        </div>

        <div className='flex flex-col gap-2 mt-3'>
          <label>Date of Birth:</label>
          {isEdit
            ? <input type="date" value={userData.dob} onChange={e => setUserData(prev => ({ ...prev, dob: e.target.value }))} />
            : <p>{userData.dob}</p>}
        </div>

        <div className='flex flex-col gap-2 mt-3'>
          <label>Gender:</label>
          {isEdit
            ? <select value={userData.gender} onChange={e => setUserData(prev => ({ ...prev, gender: e.target.value }))}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            : <p>{userData.gender}</p>}
        </div>

        <div className='flex flex-col gap-2 mt-3'>
          <label>Address Line 1:</label>
          {isEdit
            ? <input type="text" value={userData.address?.line1 || ''} onChange={e => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} />
            : <p>{userData.address?.line1}</p>}
        </div>

        <div className='flex flex-col gap-2 mt-3'>
          <label>Address Line 2:</label>
          {isEdit
            ? <input type="text" value={userData.address?.line2 || ''} onChange={e => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} />
            : <p>{userData.address?.line2}</p>}
        </div>

        <div className='mt-5'>
          {isEdit ? (
            <button onClick={handleProfileUpdate} className='px-4 py-1 border border-primary rounded-full hover:bg-primary hover:text-white'>
              Save
            </button>
          ) : (
            <button onClick={() => setIsEdit(true)} className='px-4 py-1 border border-primary rounded-full hover:bg-primary hover:text-white'>
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
