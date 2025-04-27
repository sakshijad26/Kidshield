import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaCalendarCheck, FaUserMd, FaSyringe } from 'react-icons/fa';

const DoctorSidebar = () => {
  const menuItems = [
    {
      path: '/doctor/dashboard',
      name: 'Dashboardsss',
      icon: <FaHome className="mr-2" />
    },
    {
      path: '/doctor/appointments',
      name: 'Appointments',
      icon: <FaCalendarCheck className="mr-2" />
    },
    {
      path: '/doctor/vaccinations',
      name: 'Vaccination Records',
      icon: <FaSyringe className="mr-2" />
    },
    {
      path: '/doctor/profile',
      name: 'Profile',
      icon: <FaUserMd className="mr-2" />
    }
  ];

  return (
    <div className="h-full bg-gray-800 text-white w-64 flex-shrink-0">
      <div className="p-4">
        <h2 className="text-2xl font-bold">Doctor Panel</h2>
      </div>
      <nav className="mt-6">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className="px-4 py-2">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center py-2 px-4 rounded transition-all ${
                    isActive ? 'bg-primary text-white' : 'hover:bg-gray-700'
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default DoctorSidebar;