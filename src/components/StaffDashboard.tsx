import React from 'react';

interface StaffDashboardProps {
  school: any;
  currentUser: any;
  onLogout: () => void;
}

const StaffDashboard: React.FC<StaffDashboardProps> = ({ 
  school, 
  currentUser, 
  onLogout 
}) => {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <span className="btn btn-ghost normal-case text-xl">
            {school?.name} - Staff Portal
          </span>
        </div>
        <div className="flex-none">
          <button className="btn btn-outline" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
      <div className="container mx-auto p-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Welcome, {currentUser?.name}!</h2>
            <p>This is the staff dashboard for {school?.name}.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;