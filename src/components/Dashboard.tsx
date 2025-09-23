import React from 'react';
import { School, PlatformConfig } from '../types';

interface DashboardProps {
  school: School;
  platformConfig: PlatformConfig;
}

const Dashboard: React.FC<DashboardProps> = ({ school, platformConfig }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-lg text-gray-600">Welcome to {school.name}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Students</h2>
            <p className="text-3xl font-bold text-primary">{school.students.length}</p>
            <p className="text-sm text-gray-600">Total enrolled students</p>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Staff</h2>
            <p className="text-3xl font-bold text-secondary">{school.staff.length}</p>
            <p className="text-sm text-gray-600">Active staff members</p>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Applicants</h2>
            <p className="text-3xl font-bold text-accent">{school.applicants.length}</p>
            <p className="text-sm text-gray-600">Pending applications</p>
          </div>
        </div>
      </div>
      
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">School Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Current Session:</strong> {school.currentSession}</p>
              <p><strong>Current Term:</strong> {school.currentTerm}</p>
              <p><strong>Address:</strong> {school.address}</p>
            </div>
            <div>
              <p><strong>Email:</strong> {school.email}</p>
              <p><strong>Phone:</strong> {school.phone}</p>
              <p><strong>Plan:</strong> {platformConfig.pricingPlans.find(p => p.id === school.planId)?.name || 'Unknown'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;