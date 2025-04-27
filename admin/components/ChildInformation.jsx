import React, { useContext } from 'react';
import { DoctorContext } from '../context/DoctorContext';
import { AppContext } from '../context/AppContext';

const ChildInformation = () => {
  const { childData } = useContext(DoctorContext);
  const { calculateAge } = useContext(AppContext);

  if (!childData) return null;

  return (
    <div className="bg-white p-4 rounded border mb-5">
      <h2 className="text-lg font-medium mb-3">Child Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600">Name</p>
          <p className="font-medium">{childData.name}</p>
        </div>
        <div>
          <p className="text-gray-600">Aadhaar Number</p>
          <p className="font-medium">{childData.aadhaar}</p>
        </div>
        <div>
          <p className="text-gray-600">Date of Birth</p>
          <p className="font-medium">{childData.dob}</p>
        </div>
        <div>
          <p className="text-gray-600">Age</p>
          <p className="font-medium">{childData.age || calculateAge(childData.dob)} years</p>
        </div>
        <div>
          <p className="text-gray-600">Parent/Guardian Name</p>
          <p className="font-medium">{childData.parentName || 'Not provided'}</p>
        </div>
        <div>
          <p className="text-gray-600">Location</p>
          <p className="font-medium">{childData.location || 'Not provided'}</p>
        </div>
      </div>
    </div>
  );
};

export default ChildInformation;