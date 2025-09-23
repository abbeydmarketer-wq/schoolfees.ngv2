import React, { useState } from 'react';
import { School, FeeDefinition, FeeAmount } from '../types.ts';

interface FeeStructureSettingsProps {
  school: School;
  refreshData: () => Promise<void>;
}

interface FeeModal {
  isOpen: boolean;
  editingFee?: FeeDefinition;
}

const FeeStructureSettings: React.FC<FeeStructureSettingsProps> = ({ school, refreshData }) => {
  const [modal, setModal] = useState<FeeModal>({ isOpen: false });
  const [formData, setFormData] = useState<Partial<FeeDefinition>>({
    name: '',
    category: '',
    amounts: [],
    isRecurring: false,
    description: ''
  });

  const uniqueClasses = Array.from(new Set(school.students.map(s => s.class))).sort();

  const handleOpenModal = (fee?: FeeDefinition) => {
    if (fee) {
      setFormData(fee);
    } else {
      setFormData({
        name: '',
        category: '',
        amounts: [],
        isRecurring: false,
        description: ''
      });
    }
    setModal({ isOpen: true, editingFee: fee });
  };

  const handleCloseModal = () => {
    setModal({ isOpen: false });
    setFormData({
      name: '',
      category: '',
      amounts: [],
      isRecurring: false,
      description: ''
    });
  };

  const handleAddFeeAmount = () => {
    const newAmount: FeeAmount = {
      class: uniqueClasses[0] || '',
      amount: 0,
      type: 'mandatory'
    };
    setFormData(prev => ({
      ...prev,
      amounts: [...(prev.amounts || []), newAmount]
    }));
  };

  const handleRemoveFeeAmount = (index: number) => {
    setFormData(prev => ({
      ...prev,
      amounts: prev.amounts?.filter((_, i) => i !== index) || []
    }));
  };

  const handleFeeAmountChange = (index: number, field: keyof FeeAmount, value: any) => {
    setFormData(prev => ({
      ...prev,
      amounts: prev.amounts?.map((amount, i) => 
        i === index ? { ...amount, [field]: value } : amount
      ) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save this to the backend
    console.log('Saving fee definition:', formData);
    alert('Fee structure saved successfully!');
    handleCloseModal();
    await refreshData();
  };

  const handleDeleteFee = async (feeId: string) => {
    if (confirm('Are you sure you want to delete this fee definition?')) {
      // In a real app, you would call an API to delete the fee
      console.log('Deleting fee:', feeId);
      alert('Fee definition deleted successfully!');
      await refreshData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-semibold text-secondary">Fee Structure Settings</h3>
            <p className="text-sm text-gray-500">Manage fee definitions for {school?.name}</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="btn btn-primary"
          >
            Add New Fee
          </button>
        </div>

        {/* Fee Definitions List */}
        <div className="space-y-4">
          {school.feeDefinitions?.map((fee) => (
            <div key={fee.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-lg">{fee.name}</h4>
                    <span className="badge badge-outline">{fee.category}</span>
                    {fee.isRecurring && <span className="badge badge-success">Recurring</span>}
                  </div>
                  {fee.description && (
                    <p className="text-sm text-gray-600 mt-1">{fee.description}</p>
                  )}
                  <div className="mt-3">
                    <h5 className="font-medium text-sm mb-2">Fee Amounts by Class:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {fee.amounts.map((amount, index) => (
                        <div key={index} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded text-sm">
                          <span className="font-medium">{amount.class}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono">₦{amount.amount.toLocaleString()}</span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              amount.type === 'mandatory' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {amount.type}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button 
                    onClick={() => handleOpenModal(fee)}
                    className="btn btn-sm btn-outline"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteFee(fee.id)}
                    className="btn btn-sm btn-error btn-outline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {(!school.feeDefinitions || school.feeDefinitions.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <p>No fee definitions found. Click "Add New Fee" to create your first fee structure.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {modal.editingFee ? 'Edit Fee Definition' : 'Add New Fee Definition'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Fee Name</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={formData.name || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
                    <option value="Tuition">Tuition</option>
                    <option value="Books">Books</option>
                    <option value="Uniform">Uniform</option>
                    <option value="Transport">Transport</option>
                    <option value="Boarding">Boarding</option>
                    <option value="Extra-curricular">Extra-curricular</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Description (Optional)</span>
                </label>
                <textarea
                  className="textarea textarea-bordered"
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="form-control">
                <label className="cursor-pointer flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={formData.isRecurring || false}
                    onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
                  />
                  <span className="label-text">Recurring Fee (charges every term)</span>
                </label>
              </div>

              {/* Fee Amounts */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="label-text font-medium">Fee Amounts by Class</label>
                  <button 
                    type="button"
                    onClick={handleAddFeeAmount}
                    className="btn btn-sm btn-outline"
                  >
                    Add Class
                  </button>
                </div>
                
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {formData.amounts?.map((amount, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-4">
                        <select
                          className="select select-bordered select-sm w-full"
                          value={amount.class}
                          onChange={(e) => handleFeeAmountChange(index, 'class', e.target.value)}
                          required
                        >
                          <option value="">Select class</option>
                          {uniqueClasses.map(cls => (
                            <option key={cls} value={cls}>{cls}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-4">
                        <input
                          type="number"
                          className="input input-bordered input-sm w-full"
                          placeholder="Amount"
                          value={amount.amount}
                          onChange={(e) => handleFeeAmountChange(index, 'amount', Number(e.target.value))}
                          required
                          min="0"
                        />
                      </div>
                      <div className="col-span-3">
                        <select
                          className="select select-bordered select-sm w-full"
                          value={amount.type}
                          onChange={(e) => handleFeeAmountChange(index, 'type', e.target.value as 'mandatory' | 'optional')}
                        >
                          <option value="mandatory">Mandatory</option>
                          <option value="optional">Optional</option>
                        </select>
                      </div>
                      <div className="col-span-1">
                        <button
                          type="button"
                          onClick={() => handleRemoveFeeAmount(index)}
                          className="btn btn-sm btn-error btn-outline"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                >
                  {modal.editingFee ? 'Update Fee' : 'Create Fee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeStructureSettings;