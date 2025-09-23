import React from 'react';

interface PayrollPageProps {
  school: any;
}

const PayrollPage: React.FC<PayrollPageProps> = ({ school }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Payroll Management</h2>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title">Staff Payroll</h3>
          <p>Manage payroll for {school?.name}</p>
        </div>
      </div>
    </div>
  );
};

export default PayrollPage;