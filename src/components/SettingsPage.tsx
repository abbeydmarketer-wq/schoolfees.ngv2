import React from 'react';

interface SettingsPageProps {
  school: any;
  refreshData: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ school, refreshData }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Settings</h1>
        <button className="btn btn-primary" onClick={refreshData}>
          Refresh Data
        </button>
      </div>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">School Settings</h2>
          <p>Configure settings for {school?.name}</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;