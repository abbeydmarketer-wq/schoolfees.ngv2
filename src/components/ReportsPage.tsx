import React from 'react';

interface ReportsPageProps {
  school: any;
}

const ReportsPage: React.FC<ReportsPageProps> = ({ school }) => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Reports</h1>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Financial Reports</h2>
          <p>View reports for {school?.name}</p>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;