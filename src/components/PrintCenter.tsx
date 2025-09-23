import React from 'react';

interface PrintCenterProps {
  school: any;
  platformConfig: any;
}

const PrintCenter: React.FC<PrintCenterProps> = ({ school, platformConfig }) => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Print Center</h1>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Print Documents</h2>
          <p>Print center for {school?.name}</p>
        </div>
      </div>
    </div>
  );
};

export default PrintCenter;