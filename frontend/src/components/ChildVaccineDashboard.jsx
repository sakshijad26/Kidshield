import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ChildVaccineDashboard = () => {
  const { backendUrl, token, userData } = useContext(AppContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [vaccinationHistory, setVaccinationHistory] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [childData, setChildData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Format dates for display
  const formatDate = (dateString) => {
    const date = new Date(Number(dateString));
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Format appointment slot dates
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_');
    return dateArray[0] + " " + months[Number(dateArray[1]) - 1] + " " + dateArray[2];
  };

  // Fetch child data and vaccination history
  const fetchChildData = async () => {
    setLoading(true);
    try {
      if (!userData || !userData.adharNumber) {
        toast.error("User profile data is incomplete");
        return;
      }

      // Fetch child data using Aadhaar number
      const { data } = await axios.post(
        `${backendUrl}/api/vaccine/search-child`, 
        { aadharNumber: userData.adharNumber },
        { headers: { token } }
      );

      if (data.success) {
        setChildData(data.child);
        setVaccinationHistory(data.vaccinationHistory);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch child vaccination data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user appointments
  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, { 
        headers: { token } 
      });
      
      if (data.success) {
        // Sort appointments by date (upcoming first)
        const sortedAppointments = data.appointments.sort((a, b) => {
          // Convert slot dates to comparable format
          const dateA = a.slotDate.split('_').reverse().join('-');
          const dateB = b.slotDate.split('_').reverse().join('-');
          return new Date(dateB) - new Date(dateA);
        });
        
        setAppointments(sortedAppointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch appointments");
    }
  };

  // Generate vaccination certificate for a completed vaccine
  const generateCertificate = (record) => {
    // Create certificate data
    const certificateData = {
      childName: record.childData.name,
      aadhaarNumber: record.aadharNumber,
      vaccineName: record.vaccineData.name,
      vaccinatedDate: formatDate(record.completedDate),
      doctorName: record.doctorData.name,
      doctorSpeciality: record.doctorData.speciality,
      certificateId: record._id,
      issueDate: formatDate(Date.now())
    };

    // Store certificate data in localStorage for the certificate page
    localStorage.setItem('certificateData', JSON.stringify(certificateData));
    
    // Navigate to certificate page
    navigate('/vaccine-certificate');
  };

  // Calculate vaccination progress
  const calculateProgress = () => {
    if (!vaccinationHistory.length) return 0;
    
    const completed = vaccinationHistory.filter(record => record.status === 'completed').length;
    return Math.round((completed / vaccinationHistory.length) * 100);
  };

  useEffect(() => {
    if (token && userData) {
      fetchChildData();
      fetchAppointments();
    }
  }, [token, userData]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Child Vaccination Dashboard</h1>
      
      {childData && (
        <div className="bg-blue-50 p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h2 className="text-xl font-semibold">{childData.name}</h2>
              <p className="text-gray-600">Age: {childData.age} years</p>
              <p className="text-gray-600">Aadhaar: {childData.aadhaar}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="bg-white rounded-full p-2 shadow">
                <div className="flex items-center">
                  <div className="mr-2">
                    <div className="relative w-16 h-16">
                      <svg viewBox="0 0 36 36" className="w-16 h-16">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#eee"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#4F46E5"
                          strokeWidth="3"
                          strokeDasharray={`${calculateProgress()}, 100`}
                        />
                      </svg>
                      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                        <span className="text-lg font-bold">{calculateProgress()}%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Vaccination</p>
                    <p className="text-sm">Progress</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b mb-6">
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('history')}
        >
          Vaccination History
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'appointments' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('appointments')}
        >
          Appointments
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'certificates' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('certificates')}
        >
          Certificates
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upcoming Appointments */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-lg mb-3">Upcoming Appointments</h3>
              {appointments.filter(app => !app.isCompleted && !app.cancelled).length > 0 ? (
                <div className="space-y-3">
                  {appointments.filter(app => !app.isCompleted && !app.cancelled).slice(0, 3).map((app, idx) => (
                    <div key={idx} className="border-l-4 border-blue-500 pl-3 py-2">
                      <p className="font-medium">{app.docData.name} ({app.docData.speciality})</p>
                      <p className="text-sm text-gray-600">
                        {slotDateFormat(app.slotDate)} at {app.slotTime}
                      </p>
                      {app.vaccineData && (
                        <p className="text-sm text-blue-600">Vaccine: {app.vaccineData.name}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No upcoming appointments</p>
              )}
            </div>

            {/* Recent Vaccinations */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-lg mb-3">Recent Vaccinations</h3>
              {vaccinationHistory.filter(record => record.status === 'completed').length > 0 ? (
                <div className="space-y-3">
                  {vaccinationHistory
                    .filter(record => record.status === 'completed')
                    .slice(0, 3)
                    .map((record, idx) => (
                      <div key={idx} className="border-l-4 border-green-500 pl-3 py-2">
                        <p className="font-medium">{record.vaccineData.name}</p>
                        <p className="text-sm text-gray-600">
                          Administered on: {formatDate(record.completedDate)}
                        </p>
                        <p className="text-sm text-gray-600">
                          By: Dr. {record.doctorData.name}
                        </p>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-gray-500">No completed vaccinations</p>
              )}
            </div>
          </div>

          {/* Vaccination Schedule */}
          <div className="mt-6 bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-3">Vaccination Schedule</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-3 text-left">Vaccine</th>
                    <th className="py-2 px-3 text-left">Age Group</th>
                    <th className="py-2 px-3 text-left">Status</th>
                    <th className="py-2 px-3 text-left">Next Action</th>
                  </tr>
                </thead>
                <tbody>
                  {vaccinationHistory.map((record, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="py-2 px-3">{record.vaccineData.name}</td>
                      <td className="py-2 px-3">{record.vaccineData.ageGroup}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          record.status === 'completed' ? 'bg-green-100 text-green-800' :
                          record.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        {record.status === 'completed' ? (
                          <button 
                            onClick={() => generateCertificate(record)}
                            className="text-blue-600 hover:underline text-sm"
                          >
                            View Certificate
                          </button>
                        ) : record.status === 'scheduled' ? (
                          <span className="text-sm text-gray-600">
                            {record.appointmentId ? "Appointment booked" : "Book appointment"}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-600">Reschedule</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Vaccination History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vaccine</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age Group</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {vaccinationHistory.length > 0 ? (
                  vaccinationHistory.map((record, idx) => (
                    <tr key={idx}>
                      <td className="py-3 px-4">{record.vaccineData.name}</td>
                      <td className="py-3 px-4">{record.vaccineData.ageGroup}</td>
                      <td className="py-3 px-4">Dr. {record.doctorData.name}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          record.status === 'completed' ? 'bg-green-100 text-green-800' :
                          record.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {record.status === 'completed' 
                          ? formatDate(record.completedDate) 
                          : formatDate(record.date)}
                      </td>
                      <td className="py-3 px-4">{record.notes || '-'}</td>
                      <td className="py-3 px-4">
                        {record.status === 'completed' && (
                          <button 
                            onClick={() => generateCertificate(record)}
                            className="text-blue-600 hover:underline"
                          >
                            Certificate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-3 px-4 text-center text-gray-500">
                      No vaccination records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Appointments Tab */}
      {activeTab === 'appointments' && (
        <div>
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold">My Vaccination Appointments</h3>
            <button 
              onClick={() => navigate('/book-appointment')} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Book New Appointment
            </button>
          </div>
          
          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((item, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <div className="flex items-start">
                        <div className="mr-4">
                          <img className="w-16 h-16 object-cover rounded-full" src={item.docData.image} alt="Doctor" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{item.docData.name}</h4>
                          <p className="text-sm text-gray-600">{item.docData.speciality}</p>
                          
                          {item.vaccineData && (
                            <div className="mt-2 bg-blue-50 p-2 rounded">
                              <p className="text-sm font-medium">Vaccine: {item.vaccineData.name}</p>
                              <p className="text-xs text-gray-600">Age Group: {item.vaccineData.ageGroup}</p>
                            </div>
                          )}
                          
                          <div className="mt-2">
                            <p className="text-sm"><span className="font-medium">Address:</span> {item.docData.address.line1}, {item.docData.address.line2}</p>
                            <p className="text-sm"><span className="font-medium">Date & Time:</span> {slotDateFormat(item.slotDate)} | {item.slotTime}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                      {item.isCompleted && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-2">
                          Completed
                        </span>
                      )}
                      {item.cancelled && (
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium mb-2">
                          Cancelled
                        </span>
                      )}
                      {!item.cancelled && !item.isCompleted && !item.payment && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium mb-2">
                          Payment Pending
                        </span>
                      )}
                      {!item.cancelled && !item.isCompleted && item.payment && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-2">
                          Upcoming
                        </span>
                      )}
                      
                      {!item.cancelled && !item.isCompleted && (
                        <div className="space-y-2 w-full">
                          {!item.payment && (
                            <button 
                              onClick={() => navigate(`/my-appointments`)}
                              className="w-full py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                            >
                              Pay Now
                            </button>
                          )}
                          <button 
                            onClick={() => navigate(`/my-appointments`)}
                            className="w-full py-2 border border-red-600 text-red-600 rounded hover:bg-red-50"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-500 mb-4">You don't have any vaccination appointments yet</p>
              <button 
                onClick={() => navigate('/book-appointment')} 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Book Your First Appointment
              </button>
            </div>
          )}
        </div>
      )}

      {/* Certificates Tab */}
      {activeTab === 'certificates' && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Vaccination Certificates</h3>
          
          {vaccinationHistory.filter(record => record.status === 'completed').length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vaccinationHistory
                .filter(record => record.status === 'completed')
                .map((record, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:border-blue-500">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{record.vaccineData.name}</h4>
                        <p className="text-sm text-gray-600">Issued on: {formatDate(record.completedDate)}</p>
                      </div>
                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        Verified
                      </div>
                    </div>
                    <p className="text-sm">Doctor: {record.doctorData.name}</p>
                    <p className="text-sm text-gray-600 mb-4">{record.doctorData.speciality}</p>
                    
                    <button 
                      onClick={() => generateCertificate(record)}
                      className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      View Certificate
                    </button>
                  </div>
                ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-500">No vaccination certificates available yet</p>
              <p className="text-sm text-gray-500 mt-2">Certificates will appear here after completing vaccinations</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChildVaccineDashboard;