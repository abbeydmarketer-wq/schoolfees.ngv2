import React from 'react';
import { Transaction } from '../types.ts';

interface TransactionTableProps {
  transactions: Transaction[];
  type: 'income' | 'expenditure';
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  type,
  onEdit,
  onDelete
}) => {
  const getStatusBadge = (status: Transaction['status']) => {
    const badges = {
      completed: 'badge-success',
      pending: 'badge-warning',
      failed: 'badge-error'
    };
    return `badge ${badges[status]} badge-sm`;
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No {type} records found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>
                {new Date(transaction.date).toLocaleDateString()}
              </td>
              <td>
                <div className="font-medium">{transaction.description}</div>
                {transaction.reference && (
                  <div className="text-sm text-gray-500">Ref: {transaction.reference}</div>
                )}
              </td>
              <td>
                <span className="badge badge-outline">{transaction.category}</span>
              </td>
              <td>
                <span className="font-mono font-semibold">
                  ₦{transaction.amount.toLocaleString()}
                </span>
              </td>
              <td>
                <span className={getStatusBadge(transaction.status)}>
                  {transaction.status}
                </span>
              </td>
              <td>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(transaction)}
                    className="btn btn-xs btn-outline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(transaction.id)}
                    className="btn btn-xs btn-error btn-outline"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;