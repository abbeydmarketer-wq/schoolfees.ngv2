import React from 'react';

interface StudentsViewProps {
  school: any;
  refreshData: () => void;
}

const StudentsView: React.FC<StudentsViewProps> = ({ school, refreshData }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Students</h1>
        <button className="btn btn-primary" onClick={refreshData}>
          Refresh Data
        </button>
      </div>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Student Management</h2>
          <p>Manage students for {school?.name}</p>
        </div>
      </div>
    </div>
  );
};

export default StudentsView;