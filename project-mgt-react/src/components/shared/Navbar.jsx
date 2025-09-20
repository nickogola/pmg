import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const userType = user?.userType || '';
  const userName = user ? `${user.firstName} ${user.lastName}` : '';

  return (
    <nav className="bg-indigo-700 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-white font-bold text-lg">PropertyPulse</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              {/* Tenant Navigation */}
              {isLoggedIn && userType === 'Tenant' && (
                <div className="flex space-x-4">
                  <Link 
                    to="/tenant/dashboard" 
                    className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-800"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/tenant/create-ticket" 
                    className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-800"
                  >
                    Create Ticket
                  </Link>
                  <Link 
                    to="/tenant/payment" 
                    className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-800"
                  >
                    Make Payment
                  </Link>
                </div>
              )}
              
              {/* Admin/Landlord Navigation */}
              {isLoggedIn && (userType === 'Admin' || userType === 'Landlord') && (
                <div className="flex space-x-4">
                  <Link 
                    to="/admin/dashboard" 
                    className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-800"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/admin/manage-tickets" 
                    className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-800"
                  >
                    Manage Tickets
                  </Link>
                  <Link 
                    to="/admin/announcements" 
                    className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-800"
                  >
                    Announcements
                  </Link>
                  <Link 
                    to="/admin/payment-reports" 
                    className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-800"
                  >
                    Payments
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isLoggedIn ? (
              <div className="flex items-center">
                <span className="text-white mr-3">{userName}</span>
                <button 
                  type="button"
                  onClick={handleLogout}
                  className="bg-indigo-800 p-1 rounded-full text-white hover:bg-indigo-900 focus:outline-none"
                >
                  <span className="px-2 py-1 text-sm">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link 
                  to="/login" 
                  className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-800"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white text-indigo-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button 
              type="button" 
              onClick={toggleMobileMenu} 
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-indigo-800 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <span className="block h-6 w-6 text-white">☰</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Tenant Navigation */}
            {userType === 'Tenant' && (
              <>
                <Link 
                  to="/tenant/dashboard" 
                  className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/tenant/create-ticket" 
                  className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Create Ticket
                </Link>
                <Link 
                  to="/tenant/payment" 
                  className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Make Payment
                </Link>
              </>
            )}
            
            {/* Admin/Landlord Navigation */}
            {(userType === 'Admin' || userType === 'Landlord') && (
              <>
                <Link 
                  to="/admin/dashboard" 
                  className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/admin/manage-tickets" 
                  className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Manage Tickets
                </Link>
                <Link 
                  to="/admin/announcements" 
                  className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Announcements
                </Link>
                <Link 
                  to="/admin/payment-reports" 
                  className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Payments
                </Link>
              </>
            )}
            
            {/* Login/Register or Logout for mobile */}
            {isLoggedIn ? (
              <button 
                type="button"
                onClick={handleLogout}
                className="w-full text-left text-white block px-3 py-2 rounded-md text-base font-medium bg-indigo-800 hover:bg-indigo-900"
              >
                Logout
              </button>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-white text-indigo-700 hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
