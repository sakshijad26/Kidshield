import React, { useContext, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { Link } from 'react-router-dom'

const Dashboard = () => {

  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext)
  const { slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  return dashData && (
    <div className='m-5'>

      <div className='flex flex-wrap gap-3'>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.doctor_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.doctors}</p>
            <p className='text-gray-400'>Vaccinators</p>
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
            <p className='text-gray-400'>Patients</p>
          </div>
        </div>
        {/* New Vaccine Stats Card */}
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.doctor_icon} alt="" /> {/* You may want to use a specific vaccine icon */}
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.vaccines || 0}</p>
            <p className='text-gray-400'>Vaccines</p>
          </div>
        </div>
      </div>

      {/* Add Vaccine Quick Access Button */}
      <div className='mt-6 flex'>
        <Link to="/admin/add-vaccine" className='bg-primary text-white px-6 py-2 rounded-md hover:opacity-90 transition-all flex items-center gap-2'>
          <span>+ Add Vaccine</span>
        </Link>
      </div>

      <div className='bg-white'>
        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold'>Latest Bookings</p>
        </div>

        <div className='pt-4 border border-t-0'>
          {dashData.latestAppointments.slice(0, 5).map((item, index) => (
            <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={index}>
              <img className='rounded-full w-10' src={item.docData.image} alt="" />
              <div className='flex-1 text-sm'>
                <p className='text-gray-800 font-medium'>{item.docData.name}</p>
                <p className='text-gray-600 '>Booking on {slotDateFormat(item.slotDate)}</p>
              </div>
              {item.cancelled ? <p className='text-red-400 text-xs font-medium'>Cancelled</p> : item.isCompleted ? <p className='text-green-500 text-xs font-medium'>Completed</p> : <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />}
            </div>
          ))}
        </div>
      </div>

      {/* Vaccines Section */}
      {dashData.latestVaccines && dashData.latestVaccines.length > 0 && (
        <div className='bg-white mt-8'>
          <div className='flex items-center gap-2.5 px-4 py-4 rounded-t border'>
            <img src={assets.list_icon} alt="" />
            <p className='font-semibold'>Latest Vaccines</p>
          </div>

          <div className='pt-4 border border-t-0'>
            {dashData.latestVaccines.slice(0, 5).map((item, index) => (
              <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={index}>
                <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium'>
                  {item.name.charAt(0)}
                </div>
                <div className='flex-1 text-sm'>
                  <p className='text-gray-800 font-medium'>{item.name}</p>
                  <p className='text-gray-600'>Category: {item.category} | Stock: {item.stock}</p>
                </div>
                <div className='text-sm'>
                  <p className='text-gray-600'>Age: {item.ageGroup}</p>
                  <p className='text-gray-600'>Vaccinator: {item.doctorData.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

export default Dashboard