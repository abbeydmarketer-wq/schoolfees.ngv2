import React from 'react';

interface PaymentCollectionPageProps {
  school: any;
}

const PaymentCollectionPage: React.FC<PaymentCollectionPageProps> = ({ school }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Payment Collection</h2>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title">Collect Payments</h3>
          <p>Payment collection for {school?.name}</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCollectionPage;