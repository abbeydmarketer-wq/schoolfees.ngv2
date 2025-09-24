import React from 'react';
import { School, PlatformConfig } from '../types';

interface DashboardProps {
  school: School;
  platformConfig: PlatformConfig;
}

const Dashboard: React.FC<DashboardProps> = ({ school, platformConfig }) => {
  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm sm:text-lg text-gray-600">Welcome to {school.name}</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Students</h2>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-1">{school.students.length}</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Total enrolled students</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Staff</h2>
              <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1">{school.staff.length}</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Active staff members</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Applicants</h2>
              <p className="text-2xl sm:text-3xl font-bold text-orange-600 mt-1">{school.applicants.length}</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Pending applications</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4 sm:p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">School Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-3">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Current Session</span>
              <span className="text-sm font-semibold text-gray-800">{school.currentSession}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Current Term</span>
              <span className="text-sm font-semibold text-gray-800">{school.currentTerm}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Address</span>
              <span className="text-sm font-semibold text-gray-800">{school.address}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</span>
              <span className="text-sm font-semibold text-gray-800">{school.email}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</span>
              <span className="text-sm font-semibold text-gray-800">{school.phone}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</span>
              <span className="text-sm font-semibold text-blue-600">{platformConfig.pricingPlans.find(p => p.id === school.planId)?.name || 'Unknown'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;