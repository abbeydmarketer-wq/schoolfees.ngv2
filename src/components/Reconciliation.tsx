import React from 'react';

interface ReconciliationProps {
  school: any;
}

const Reconciliation: React.FC<ReconciliationProps> = ({ school }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Reconciliation</h2>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title">Financial Reconciliation</h3>
          <p>Reconciliation for {school?.name}</p>
        </div>
      </div>
    </div>
  );
};

export default Reconciliation;