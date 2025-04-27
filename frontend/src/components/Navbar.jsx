import React, { useContext, useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Menu, X, ChevronDown, User, Calendar, LogOut } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { token, setToken, userData } = useContext(AppContext);

  // Detect scroll to add background effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(false);
    navigate('/login');
  };

  // Animation variants for menu items
  const menuItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
      },
    }),
  };

  return (
    <div 
      className={`sticky top-0 z-50 w-full flex items-center justify-between py-4 px-4 md:px-8 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      {/* Logo */}
      <div 
        onClick={() => navigate('/')} 
        className="flex items-center cursor-pointer transition-transform hover:scale-105"
      >
        <img className="w-44" src={assets.logo} alt="KidShield Logo" />
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `relative font-medium text-sm py-2 transition-colors ${
              isActive ? 'text-primary' : 'text-gray-700 hover:text-primary'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span>HOME</span>
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                isActive ? 'w-full' : 'w-0'
              }`}></span>
            </>
          )}
        </NavLink>
        <NavLink 
          to="/doctors" 
          className={({ isActive }) => 
            `relative font-medium text-sm py-2 transition-colors ${
              isActive ? 'text-primary' : 'text-gray-700 hover:text-primary'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span>ALL VACCINES</span>
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                isActive ? 'w-full' : 'w-0'
              }`}></span>
            </>
          )}
        </NavLink>
        <NavLink 
          to="/about" 
          className={({ isActive }) => 
            `relative font-medium text-sm py-2 transition-colors ${
              isActive ? 'text-primary' : 'text-gray-700 hover:text-primary'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span>ABOUT</span>
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                isActive ? 'w-full' : 'w-0'
              }`}></span>
            </>
          )}
        </NavLink>
        <NavLink 
          to="/contact" 
          className={({ isActive }) => 
            `relative font-medium text-sm py-2 transition-colors ${
              isActive ? 'text-primary' : 'text-gray-700 hover:text-primary'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span>CONTACT</span>
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                isActive ? 'w-full' : 'w-0'
              }`}></span>
            </>
          )}
        </NavLink>
      </nav>

      {/* Auth Section */}
      <div className="flex items-center gap-4">
        {token && userData ? (
          <div className="group relative">
            <div className="flex items-center gap-2 cursor-pointer p-2 rounded-full hover:bg-gray-100">
              <img 
                className="w-8 h-8 rounded-full object-cover border border-gray-200" 
                src={userData.image} 
                alt={userData.name || "User"} 
              />
              <span className="hidden md:block font-medium text-gray-700 mr-1">
                {userData.name?.split(' ')[0] || "User"}
              </span>
              <ChevronDown size={16} className="text-gray-500 group-hover:text-primary transition-colors" />
            </div>
            
            {/* Dropdown Menu */}
            <div className="absolute top-full right-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
              <div className="bg-white rounded-lg shadow-lg border border-gray-100 py-2 overflow-hidden">
                <div 
                  onClick={() => navigate('/my-profile')} 
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
                >
                  <User size={18} className="text-primary" />
                  <span className="text-gray-700">My Profile</span>
                </div>
                <div 
                  onClick={() => navigate('/my-appointments')} 
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
                >
                  <Calendar size={18} className="text-primary" />
                  <span className="text-gray-700">My Appointments</span>
                </div>
                <div className="border-t border-gray-100 my-1"></div>
                <div 
                  onClick={logout} 
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
                >
                  <LogOut size={18} className="text-red-500" />
                  <span className="text-red-500">Logout</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => navigate('/login')} 
            className="hidden md:flex items-center bg-primary text-white px-6 py-2 rounded-full font-medium hover:bg-primary/90 transition-colors"
          >
            Create Account
          </button>
        )}
        
        {/* Mobile menu button */}
        <button 
          onClick={() => setShowMenu(true)}
          className="p-2 rounded-full hover:bg-gray-100 md:hidden"
        >
          <Menu size={24} className="text-gray-700" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {showMenu && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowMenu(false)}>
          {/* Prevent clicks on the menu itself from closing the menu */}
          <div 
            className="absolute right-0 top-0 bottom-0 w-full max-w-xs bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <img src={assets.logo} className="w-36" alt="KidShield Logo" />
              <button 
                onClick={() => setShowMenu(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X size={24} className="text-gray-700" />
              </button>
            </div>
            
            <nav className="flex flex-col gap-4">
              <NavLink 
                to="/" 
                onClick={() => setShowMenu(false)}
                className={({ isActive }) => 
                  `py-3 px-4 rounded-lg font-medium ${
                    isActive ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                HOME
              </NavLink>
              <NavLink 
                to="/doctors" 
                onClick={() => setShowMenu(false)}
                className={({ isActive }) => 
                  `py-3 px-4 rounded-lg font-medium ${
                    isActive ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                ALL VACCINES
              </NavLink>
              <NavLink 
                to="/about" 
                onClick={() => setShowMenu(false)}
                className={({ isActive }) => 
                  `py-3 px-4 rounded-lg font-medium ${
                    isActive ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                ABOUT
              </NavLink>
              <NavLink 
                to="/contact" 
                onClick={() => setShowMenu(false)}
                className={({ isActive }) => 
                  `py-3 px-4 rounded-lg font-medium ${
                    isActive ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                CONTACT
              </NavLink>
            </nav>
            
            {!token && (
              <div className="mt-8">
                <button 
                  onClick={() => {
                    navigate('/login');
                    setShowMenu(false);
                  }} 
                  className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Create Account
                </button>
              </div>
            )}
            
            {token && userData && (
              <div className="mt-8 border-t pt-6">
                <div className="flex items-center gap-3 mb-6">
                  <img 
                    className="w-10 h-10 rounded-full object-cover border border-gray-200" 
                    src={userData.image} 
                    alt={userData.name || "User"} 
                  />
                  <div>
                    <p className="font-medium">{userData.name || "User"}</p>
                    <p className="text-sm text-gray-500">{userData.email || ""}</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => {
                      navigate('/my-profile');
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-3 py-3 px-4 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    <User size={18} />
                    <span>My Profile</span>
                  </button>
                  <button 
                    onClick={() => {
                      navigate('/my-appointments');
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-3 py-3 px-4 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    <Calendar size={18} />
                    <span>My Appointments</span>
                  </button>
                  <button 
                    onClick={() => {
                      logout();
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-3 py-3 px-4 rounded-lg text-red-500 hover:bg-red-50"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;