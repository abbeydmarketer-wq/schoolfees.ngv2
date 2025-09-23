import React, { useState, useEffect } from 'react';
import { Transaction } from '../types.ts';

interface TransactionModalProps {
  schoolId: string;
  config: {
    type: 'income' | 'expenditure';
    data?: Transaction;
  };
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  schoolId,
  config,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<Transaction>>({
    amount: 0,
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    reference: '',
    status: 'completed',
    type: config.type === 'income' ? 'income' : 'expense'
  });

  useEffect(() => {
    if (config.data) {
      setFormData(config.data);
    }
  }, [config.data]);

  const categories = {
    income: [
      'Tuition Fees',
      'Registration Fees',
      'Donations',
      'Grants',
      'Other Income'
    ],
    expenditure: [
      'Salaries',
      'Utilities',
      'Supplies',
      'Maintenance',
      'Equipment',
      'Other Expenses'
    ]
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const transaction: Transaction = {
      id: config.data?.id || `txn_${Date.now()}`,
      amount: Number(formData.amount) || 0,
      description: formData.description || '',
      category: formData.category || '',
      date: formData.date || new Date().toISOString().split('T')[0],
      reference: formData.reference,
      status: formData.status || 'completed',
      type: config.type === 'income' ? 'income' : 'expense'
    };

    onSave(transaction);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {config.data ? 'Edit' : 'Add'} {config.type === 'income' ? 'Income' : 'Expenditure'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Amount (₦)</span>
            </label>
            <input
              type="number"
              className="input input-bordered"
              value={formData.amount || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Category</span>
            </label>
            <select
              className="select select-bordered"
              value={formData.category || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              required
            >
              <option value="">Select category</option>
              {categories[config.type].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Date</span>
            </label>
            <input
              type="date"
              className="input input-bordered"
              value={formData.date || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Reference (Optional)</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              value={formData.reference || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Status</span>
            </label>
            <select
              className="select select-bordered"
              value={formData.status || 'completed'}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Transaction['status'] }))}
            >
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="btn btn-primary"
            >
              {config.data ? 'Update' : 'Add'} {config.type === 'income' ? 'Income' : 'Expenditure'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;