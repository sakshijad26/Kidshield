import { createContext, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';


export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '');
    const [appointments, setAppointments] = useState([]);
    const [dashData, setDashData] = useState(false);
    const [profileData, setProfileData] = useState(false);
    const [childData, setChildData] = useState(null);
    const [vaccinationHistory, setVaccinationHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    // Getting Doctor appointment data from Database using API
    const getAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/appointments', { headers: { dToken } });

            if (data.success) {
                setAppointments(data.appointments.reverse());
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    // Getting Doctor profile data from Database using API
    const getProfileData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/profile', { headers: { dToken } });
            console.log(data.profileData);
            setProfileData(data.profileData);
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    // Function to cancel doctor appointment using API
    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/cancel-appointment', { appointmentId }, { headers: { dToken } });

            if (data.success) {
                toast.success(data.message);
                getAppointments();
                // after creating dashboard
                getDashData();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    };

    // Function to Mark appointment completed using API
    const completeAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/complete-appointment', { appointmentId }, { headers: { dToken } });

            if (data.success) {
                toast.success(data.message);
                getAppointments();
                // Later after creating getDashData Function
                getDashData();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    };

    // Getting Doctor dashboard data using API
    const getDashData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/dashboard', { headers: { dToken } });

            if (data.success) {
                setDashData(data.dashData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    // Search for a child by Aadhaar number
    const searchChildByAadhar = async (aadharNumber) => {
        try {
            setLoading(true);
            const { data } = await axios.post(
                backendUrl + '/api/doctor/search-child',
                { aadharNumber },
                { headers: { dToken } }
            );

            if (data.success) {
                setChildData(data.child);
                setVaccinationHistory(data.vaccinationHistory);
                return data;
            } else {
                toast.error(data.message);
                setChildData(null);
                setVaccinationHistory([]);
                return null;
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message || "Failed to search child");
            setChildData(null);
            setVaccinationHistory([]);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Add a new vaccination record
    const addVaccinationRecord = async (recordData) => {
        try {
            setLoading(true);
            const { data } = await axios.post(
                backendUrl + '/api/doctor/add-vaccination-record',
                recordData,
                { headers: { dToken } }
            );

            if (data.success) {
                toast.success(data.message);
                // Refresh vaccination history
                if (childData) {
                    await searchChildByAadhar(childData.aadhaar);
                }
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message || "Failed to add vaccination record");
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Update vaccination status
    const updateVaccinationStatus = async (recordId, status, notes) => {
        try {
            setLoading(true);
            const { data } = await axios.post(
                backendUrl + '/api/doctor/update-vaccination-status',
                { recordId, status, notes },
                { headers: { dToken } }
            );

            if (data.success) {
                toast.success(data.message);
                // Refresh vaccination history
                if (childData) {
                    await searchChildByAadhar(childData.aadhaar);
                }
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message || "Failed to update vaccination status");
            return false;
        } finally {
            setLoading(false);
        }
    };

// Add this new function to your DoctorContextProvider in DoctorContext.jsx
// Place it with the other functions

// Fetch available vaccines
const getVaccines = async () => {
    try {
        setLoading(true);
        const { data } = await axios.get(backendUrl + '/api/doctor/vaccines', { headers: { dToken } });

        if (data.success) {
            return data.vaccines;
        } else {
            toast.error(data.message);
            return [];
        }
    } catch (error) {
        console.log(error);
        toast.error(error.message || "Failed to fetch vaccines");
        return [];
    } finally {
        setLoading(false);
    }
};


    // Add getVaccines to your value object
const value = {
    dToken, setDToken, backendUrl,
    appointments,
    getAppointments,
    cancelAppointment,
    completeAppointment,
    dashData, getDashData,
    profileData, setProfileData,
    getProfileData,
    // New vaccination record functions
    childData, setChildData,
    vaccinationHistory, setVaccinationHistory,
    loading,
    searchChildByAadhar,
    addVaccinationRecord,
    updateVaccinationStatus,
    getVaccines  // Add this line
};
    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    );
};

export default DoctorContextProvider;