import React from 'react';
import { View } from '../types';

interface HeaderProps {
  view: View;
  schoolName: string;
  adminName: string;
  isImpersonating: boolean;
}

const Header: React.FC<HeaderProps> = ({ view, schoolName, adminName, isImpersonating }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-50">
      <div className="navbar px-4 sm:px-6 min-h-16">
        <div className="navbar-start flex items-center">
          <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost lg:hidden mr-2">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </label>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <h1 className="text-lg sm:text-xl font-bold text-gray-800 truncate max-w-[150px] sm:max-w-none">
              {schoolName}
            </h1>
            {isImpersonating && (
              <span className="badge badge-warning badge-sm hidden sm:inline-flex">Impersonating</span>
            )}
          </div>
        </div>
        
        <div className="navbar-center hidden sm:block">
          <h2 className="text-lg font-medium text-primary">{view}</h2>
        </div>
        
        <div className="navbar-end flex items-center space-x-2">
          {/* Mobile view title */}
          <h2 className="text-sm font-medium text-primary sm:hidden truncate max-w-[80px]">{view}</h2>
          
          {/* Mobile impersonation badge */}
          {isImpersonating && (
            <span className="badge badge-warning badge-xs sm:hidden">Imp</span>
          )}
          
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary text-primary-content flex items-center justify-center text-sm sm:text-base font-semibold">
                {adminName.charAt(0).toUpperCase()}
              </div>
            </label>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-lg menu menu-sm dropdown-content bg-white border border-gray-200 rounded-lg w-48 sm:w-52">
              <li className="menu-title text-xs text-gray-500 px-3 py-2">
                <span>{adminName}</span>
              </li>
              <li><a href="#profile" className="text-gray-700 hover:bg-gray-50">Profile</a></li>
              <li><a href="#settings" className="text-gray-700 hover:bg-gray-50">Settings</a></li>
              <li><a href="#logout" className="text-red-600 hover:bg-red-50">Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;