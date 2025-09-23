import React from 'react';
import { School } from '../types.ts';

interface ReconciliationProps {
  school: School;
}

const Reconciliation: React.FC<ReconciliationProps> = ({ school }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-semibold text-secondary mb-4">Reconciliation</h3>
      <p className="text-sm text-gray-500 mb-6">Account reconciliation for {school.name}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-lg mb-2">Bank Statement</h4>
          <p className="text-sm text-gray-600">Upload your bank statement to reconcile transactions</p>
          <button className="mt-3 btn btn-outline btn-sm">
            Upload Statement
          </button>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-lg mb-2">Outstanding Items</h4>
          <p className="text-sm text-gray-600">Review unmatched transactions</p>
          <div className="mt-3 text-center text-gray-500">
            No outstanding items found
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="alert alert-info">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>Bank reconciliation helps ensure accuracy between your records and bank statements.</span>
        </div>
      </div>
    </div>
  );
};

export default Reconciliation;