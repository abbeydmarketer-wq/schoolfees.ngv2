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
    <header className="fixed top-0 left-0 right-0 bg-base-100 shadow-md z-50">
      <div className="navbar px-6">
        <div className="navbar-start">
          <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost lg:hidden">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </label>
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-bold">{schoolName}</h1>
            {isImpersonating && (
              <span className="badge badge-warning">Impersonating</span>
            )}
          </div>
        </div>
        
        <div className="navbar-center">
          <h2 className="text-lg font-medium">{view}</h2>
        </div>
        
        <div className="navbar-end">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                {adminName.charAt(0).toUpperCase()}
              </div>
            </label>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li><a href="#profile">Profile</a></li>
              <li><a href="#settings">Settings</a></li>
              <li><a href="#logout">Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;