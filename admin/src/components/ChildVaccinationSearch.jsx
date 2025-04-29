import React, { useState, useContext } from 'react';
import { DoctorContext } from '../context/DoctorContext';

const ChildVaccinationSearch = () => {
  const { searchChildByAadhar, loading } = useContext(DoctorContext);
  const [aadharNumber, setAadharNumber] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (aadharNumber.trim()) {
      await searchChildByAadhar(aadharNumber.trim());
    }
  };

  return (
    <div className="bg-white p-4 rounded border mb-5">
      <h2 className="text-lg font-medium mb-3">Search Child by Aadhaar Number</h2>
      <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
        <input
          type="text"
          value={aadharNumber}
          onChange={(e) => setAadharNumber(e.target.value)}
          placeholder="Enter Aadhaar Number"
          className="py-2 px-3 border rounded flex-1"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 transition-all disabled:opacity-70"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
    </div>
  );
};

export default ChildVaccinationSearch;