import React from 'react';
import ChildVaccinationSearch from './ChildVaccinationSearch';
import ChildInformation from './ChildInformation';
import VaccinationHistoryTable from './VaccinationHistoryTable';
import AddVaccinationRecord from './AddVaccinationRecord';

const VaccinationManagement = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Vaccination Management</h1>
      
      <ChildVaccinationSearch />
      <ChildInformation />
      <VaccinationHistoryTable />
      <AddVaccinationRecord />
    </div>
  );
};

export default VaccinationManagement;