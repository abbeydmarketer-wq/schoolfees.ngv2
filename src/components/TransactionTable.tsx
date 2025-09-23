import React from 'react';

interface TransactionTableProps {
  transactions?: any[];
  school: any;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions = [], school }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Type</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.date || 'N/A'}</td>
                <td>{transaction.description || 'N/A'}</td>
                <td>{transaction.type || 'N/A'}</td>
                <td>{transaction.amount || '0'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center text-gray-500">
                No transactions found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;