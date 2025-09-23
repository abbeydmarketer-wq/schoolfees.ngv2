import React from 'react';

interface TeamPageProps {
  school: any;
  refreshData: () => void;
}

const TeamPage: React.FC<TeamPageProps> = ({ school, refreshData }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Team</h1>
        <button className="btn btn-primary" onClick={refreshData}>
          Refresh Data
        </button>
      </div>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Team Management</h2>
          <p>Manage team members for {school?.name}</p>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;