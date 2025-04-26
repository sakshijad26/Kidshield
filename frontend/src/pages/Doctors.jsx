import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'

const Doctors = () => {
  const { speciality } = useParams()
  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    } else {
      setFilterDoc(doctors)
    }
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])

  return (
    <div>
      <p className='text-gray-600'>Browse through the doctors specialist.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`}
        >
          Filters
        </button>

        {/* Filters */}
        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          <p
            onClick={() => navigate('/doctors')}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${!speciality ? 'bg-[#E2E5FF] text-black' : ''}`}
          >
            All Doctors
          </p>
          <p
            onClick={() => navigate('/doctors/BCG (Bacillus Calmette–Guérin)')}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'BCG (Bacillus Calmette–Guérin)' ? 'bg-[#E2E5FF] text-black' : ''}`}
          >
            BCG (Bacillus Calmette–Guérin)
          </p>
          <p
            onClick={() => navigate('/doctors/OPV & IPV (Oral Polio Vaccine & Inactivated Polio Vaccine)')}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'OPV & IPV (Oral Polio Vaccine & Inactivated Polio Vaccine)' ? 'bg-[#E2E5FF] text-black' : ''}`}
          >
            OPV & IPV (Oral Polio Vaccine & Inactivated Polio Vaccine)
          </p>
          <p
            onClick={() => navigate('/doctors/Hepatitis B Vaccine')}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Hepatitis B Vaccine' ? 'bg-[#E2E5FF] text-black' : ''}`}
          >
            Hepatitis B Vaccine
          </p>
          <p
            onClick={() => navigate('/doctors/Pentavalent Vaccine')}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Pentavalent Vaccine' ? 'bg-[#E2E5FF] text-black' : ''}`}
          >
            Pentavalent Vaccine
          </p>
          <p
            onClick={() => navigate('/doctors/Rotavirus Vaccine')}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Rotavirus Vaccine' ? 'bg-[#E2E5FF] text-black' : ''}`}
          >
            Rotavirus Vaccine
          </p>
          <p
            onClick={() => navigate('/doctors/Measles and Rubella (MR) Vaccine')}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Measles and Rubella (MR) Vaccine' ? 'bg-[#E2E5FF] text-black' : ''}`}
          >
            Measles and Rubella (MR) Vaccine
          </p>
        </div>

        {/* Doctor Cards */}
        <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
          {filterDoc.map((item, index) => (
            <div
              onClick={() => {
                navigate(`/appointment/${item._id}`)
                scrollTo(0, 0)
              }}
              className='border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'
              key={index}
            >
              <img className='bg-[#EAEFFF]' src={item.image} alt="" />
              <div className='p-4'>
                <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : "text-gray-500"}`}>
                  <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : "bg-gray-500"}`}></p>
                  <p>{item.available ? 'Available' : "Not Available"}</p>
                </div>
                <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
                <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Doctors
