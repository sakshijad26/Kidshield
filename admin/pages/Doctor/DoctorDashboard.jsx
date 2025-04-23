import React, { useState } from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import ChildVaccinationSearch from '../../components/ChildVaccinationSearch'
import ChildInformation from '../../components/ChildInformation'
import VaccinationHistoryTable from '../../components/VaccinationHistoryTable'
import AddVaccinationRecord from '../../components/AddVaccinationRecord'

const DoctorDashboard = () => {
  const { dToken, dashData, getDashData, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const { slotDateFormat, currency } = useContext(AppContext)
  const [activeTab, setActiveTab] = useState('appointments')

  useEffect(() => {
    if (dToken) {
      getDashData()
    }
  }, [dToken])

  return dashData && (
    <div className='m-5'>
      <div className='flex flex-wrap gap-3'>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.earning_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{currency} {dashData.earnings}</p>
            <p className='text-gray-400'>Earnings</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.appointments}</p>
            <p className='text-gray-400'>Appointments</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.patients_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.patients}</p>
            <p className='text-gray-400'>Patients</p></div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex border-b mb-4 mt-6">
        <button 
          className={`py-2 px-4 font-medium ${activeTab === 'appointments' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
          onClick={() => setActiveTab('appointments')}
        >
          Appointments
        </button>
        <button 
          className={`py-2 px-4 font-medium ${activeTab === 'vaccinations' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
          onClick={() => setActiveTab('vaccinations')}
        >
          Vaccination Records
        </button>
      </div>

      {/* Appointments Tab */}
      {activeTab === 'appointments' && (
        <div className='bg-white'>
          <div className='flex items-center gap-2.5 px-4 py-4 rounded-t border'>
            <img src={assets.list_icon} alt="" />
            <p className='font-semibold'>Latest Bookings</p>
          </div>
          <div className='pt-4 border border-t-0'>
            {dashData.latestAppointments.slice(0, 5).map((item, index) => (
              <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={index}>
                <img className='rounded-full w-10' src={item.userData.image} alt="" />
                <div className='flex-1 text-sm'>
                  <p className='text-gray-800 font-medium'>{item.userData.name}</p>
                  <p className='text-gray-600 '>Booking on {slotDateFormat(item.slotDate)}</p>
                </div>
                {item.cancelled
                  ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                  : item.isCompleted
                    ? <p className='text-green-500 text-xs font-medium'>Completed</p>
                    : <div className='flex'>
                      <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                      <img onClick={() => completeAppointment(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
                    </div>
                }
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vaccination Records Tab */}
      {activeTab === 'vaccinations' && (
        <div>
          <ChildVaccinationSearch />
          <ChildInformation />
          <VaccinationHistoryTable />
          <AddVaccinationRecord />
        </div>
      )}
    </div>
  )
}

export default DoctorDashboard