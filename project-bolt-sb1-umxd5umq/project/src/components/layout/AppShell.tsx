import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Pill, PieChart, Calendar, Settings, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AppShell: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
      isActive
        ? 'bg-indigo-100 text-indigo-700'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 right-0 p-4 z-40">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow border-r border-gray-200 bg-white overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 py-6">
            <div className="h-10 w-10 bg-indigo-600 text-white rounded-md flex items-center justify-center mr-3">
              <Pill size={24} />
            </div>
            <span className="text-xl font-bold text-gray-900">MedTrack</span>
          </div>
          <div className="flex-grow flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              <NavLink to="/dashboard" className={navLinkClass}>
                <Calendar className="mr-3 h-5 w-5" />
                Dashboard
              </NavLink>
              <NavLink to="/medications" className={navLinkClass}>
                <Pill className="mr-3 h-5 w-5" />
                Medications
              </NavLink>
              <NavLink to="/analytics" className={navLinkClass}>
                <PieChart className="mr-3 h-5 w-5" />
                Analytics
              </NavLink>
              <NavLink to="/settings" className={navLinkClass}>
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </NavLink>
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{user?.name || 'User'}</p>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-gray-500 hover:text-gray-900 flex items-center group"
                  >
                    <LogOut className="mr-1 h-4 w-4 group-hover:text-red-500" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div
        className={`fixed inset-0 bg-gray-600 bg-opacity-75 z-30 transition-opacity lg:hidden ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMobileMenu}
      ></div>
      
      <div
        className={`fixed inset-y-0 left-0 flex flex-col z-40 w-64 bg-white transform transition-transform lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center flex-shrink-0 px-4 py-6">
          <div className="h-10 w-10 bg-indigo-600 text-white rounded-md flex items-center justify-center mr-3">
            <Pill size={24} />
          </div>
          <span className="text-xl font-bold text-gray-900">MedTrack</span>
        </div>
        <div className="flex-grow flex flex-col">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            <NavLink to="/dashboard" className={navLinkClass} onClick={closeMobileMenu}>
              <Calendar className="mr-3 h-5 w-5" />
              Dashboard
            </NavLink>
            <NavLink to="/medications" className={navLinkClass} onClick={closeMobileMenu}>
              <Pill className="mr-3 h-5 w-5" />
              Medications
            </NavLink>
            <NavLink to="/analytics" className={navLinkClass} onClick={closeMobileMenu}>
              <PieChart className="mr-3 h-5 w-5" />
              Analytics
            </NavLink>
            <NavLink to="/settings" className={navLinkClass} onClick={closeMobileMenu}>
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </NavLink>
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex-shrink-0 w-full group block">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.name || 'User'}</p>
                <button
                  onClick={handleLogout}
                  className="text-xs text-gray-500 hover:text-gray-900 flex items-center group"
                >
                  <LogOut className="mr-1 h-4 w-4 group-hover:text-red-500" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="lg:pl-64">
        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppShell;