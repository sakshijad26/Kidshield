import React, { useState, useEffect, useContext } from 'react';
import { DoctorContext } from '../context/DoctorContext';

const AddVaccinationRecord = () => {
  const { childData, addVaccinationRecord, loading, getVaccines } = useContext(DoctorContext);
  const [vaccines, setVaccines] = useState([]);
  const [selectedVaccine, setSelectedVaccine] = useState('');
  const [status, setStatus] = useState('scheduled');
  const [notes, setNotes] = useState('');
  const [fetchingVaccines, setFetchingVaccines] = useState(false);

  useEffect(() => {
    const loadVaccines = async () => {
      try {
        setFetchingVaccines(true);
        const vaccinesList = await getVaccines();
        setVaccines(vaccinesList || []);
      } catch (error) {
        console.error("Failed to fetch vaccines:", error);
      } finally {
        setFetchingVaccines(false);
      }
    };

    if (childData) {
      loadVaccines();
    }
  }, [childData, getVaccines]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!childData || !selectedVaccine) return;

    const recordData = {
      childId: childData._id,
      aadharNumber: childData.aadhaar,
      childData,
      vaccineId: selectedVaccine,
      status,
      notes
    };

    const success = await addVaccinationRecord(recordData);
    if (success) {
      // Reset form
      setSelectedVaccine('');
      setStatus('scheduled');
      setNotes('');
    }
  };

  if (!childData) return null;

  return (
    <div className="bg-white p-4 rounded border mb-5">
      <h2 className="text-lg font-medium mb-3">Add Vaccination Record</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vaccine">
            Vaccine
          </label>
          <select
            id="vaccine"
            value={selectedVaccine}
            onChange={(e) => setSelectedVaccine(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            disabled={fetchingVaccines}
          >
            <option value="">
              {fetchingVaccines ? 'Loading vaccines...' : 'Select a vaccine'}
            </option>
            {vaccines.map((vaccine) => (
              <option key={vaccine._id} value={vaccine._id}>
                {vaccine.name} - {vaccine.category}
              </option>
            ))}
          </select>
          {vaccines.length === 0 && !fetchingVaccines && (
            <p className="text-red-500 text-xs italic mt-1">No vaccines available. Please ensure vaccines are added to the system.</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="missed">Missed</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="3"
          ></textarea>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={loading || fetchingVaccines || vaccines.length === 0}
            className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Add Record'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddVaccinationRecord;