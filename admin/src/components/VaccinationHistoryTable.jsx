import React, { useContext } from 'react';
import { DoctorContext } from '../context/DoctorContext';
import { AppContext } from '../context/AppContext';

const VaccinationHistoryTable = () => {
  const { vaccinationHistory, updateVaccinationStatus } = useContext(DoctorContext);
  const { slotDateFormat } = useContext(AppContext);

  if (!vaccinationHistory || vaccinationHistory.length === 0) {
    return (
      <div className="bg-white p-4 rounded border mb-5">
        <h2 className="text-lg font-medium mb-3">Vaccination History</h2>
        <p className="text-gray-500">No vaccination records found for this child.</p>
      </div>
    );
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;
  };

  const handleStatusUpdate = async (recordId, newStatus) => {
    const notes = prompt("Add notes for this status update (optional):");
    await updateVaccinationStatus(recordId, newStatus, notes);
  };

  return (
    <div className="bg-white p-4 rounded border mb-5">
      <h2 className="text-lg font-medium mb-3">Vaccination History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vaccine</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
           {/*   <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vaccinationHistory.map((record) => (
              <tr key={record._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{record.vaccineData.name}</div>
                  <div className="text-sm text-gray-500">{record.vaccineData.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {record.status === 'completed' 
                      ? slotDateFormat(formatDate(record.completedDate))
                      : slotDateFormat(formatDate(record.date))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{record.doctorData.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${record.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      record.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {record.notes || '-'}
                </td>
               {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {record.status !== 'completed' && (
                    <button
                      onClick={() => handleStatusUpdate(record._id, 'completed')}
                      className="text-primary hover:text-primary/80 mr-3"
                    >
                      Mark Complete
                    </button>
                  )}
                  {record.status !== 'missed' && record.status !== 'completed' && (
                    <button
                      onClick={() => handleStatusUpdate(record._id, 'missed')}
                      className="text-red-600 hover:text-red-900"
                    >
                      Mark Missed
                    </button>
                  )}
                </td>
               */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VaccinationHistoryTable;