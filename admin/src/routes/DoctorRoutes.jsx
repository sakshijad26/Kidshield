import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DoctorLogin from '../components/doctor/DoctorLogin';
import DoctorDashboard from '../components/doctor/DoctorDashboard';
import AppointmentsPage from '../components/doctor/AppointmentsPage';
import DoctorProfile from '../components/doctor/DoctorProfile';
import DoctorLayout from '../components/layouts/DoctorLayout';
import VaccinationManagement from '../components/doctor/VaccinationManagement';
import DoctorPrivateRoute from './DoctorPrivateRoute';

const DoctorRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<DoctorLogin />} />
      
      <Route path="/" element={
        <DoctorPrivateRoute>
          <DoctorLayout />
        </DoctorPrivateRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DoctorDashboard />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="profile" element={<DoctorProfile />} />
        <Route path="vaccinations" element={<VaccinationManagement />} />
      </Route>
    </Routes>
  );
};

export default DoctorRoutes;