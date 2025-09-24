// School Admin Fee Management - Parent Payment Configuration Interface
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { feeManagementService } from '../services/feeManagementService';
import { 
  FeeCategory, 
  FeeStructure, 
  InstallmentPlan, 
  ParentFeeRecord,
  SchoolAdminFeeMetrics 
} from '../types';

interface SchoolAdminFeeManagementProps {
  schoolId: string;
}

const SchoolAdminFeeManagement: React.FC<SchoolAdminFeeManagementProps> = ({ schoolId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [feeMetrics, setFeeMetrics] = useState<SchoolAdminFeeMetrics | null>(null);
  const [feeCategories, setFeeCategories] = useState<FeeCategory[]>([]);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [parentFeeRecords, setParentFeeRecords] = useState<ParentFeeRecord[]>([]);
  const [installmentPlans, setInstallmentPlans] = useState<InstallmentPlan[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [showCreateFeeStructure, setShowCreateFeeStructure] = useState(false);
  const [showCreateInstallment, setShowCreateInstallment] = useState(false);
  
  // Form states
  const [newCategory, setNewCategory] = useState<Partial<FeeCategory>>({
    name: '',
    description: '',
    isCompulsory: true,
    applicableClasses: [],
    academicYear: '2023/2024'
  });

  const [newFeeStructure, setNewFeeStructure] = useState<Partial<FeeStructure>>({
    categoryId: '',
    className: '',
    amount: 0,
    currency: 'NGN',
    dueDate: '',
    lateFeeAmount: 0,
    lateFeeType: 'fixed',
    allowInstallments: false,
    isActive: true
  });

  const [newInstallmentPlan, setNewInstallmentPlan] = useState<Partial<InstallmentPlan>>({
    name: '',
    numberOfInstallments: 3,
    installmentAmounts: [],
    dueDates: [],
    processingFee: 0
  });

  const availableClasses = [
    'Nursery', 'Pre-KG', 'KG',
    'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6',
    'JSS 1', 'JSS 2', 'JSS 3',
    'SSS 1', 'SSS 2', 'SSS 3'
  ];

  useEffect(() => {
    loadFeeData();
  }, [schoolId]);

  const loadFeeData = async () => {
    setLoading(true);
    try {
      const [metrics, categories, structures, records, plans] = await Promise.all([
        feeManagementService.getSchoolAdminFeeMetrics(schoolId),
        feeManagementService.getFeeCategories(schoolId),
        feeManagementService.getFeeStructures(schoolId),
        feeManagementService.getParentFeeRecords(schoolId),
        feeManagementService.getInstallmentPlans(schoolId)
      ]);

      setFeeMetrics(metrics);
      setFeeCategories(categories);
      setFeeStructures(structures);
      setParentFeeRecords(records);
      setInstallmentPlans(plans);
    } catch (error) {
      console.error('Failed to load fee data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.name || !newCategory.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const category = await feeManagementService.createFeeCategory({
        ...newCategory,
        schoolId
      } as Omit<FeeCategory, 'id' | 'createdAt' | 'updatedAt'>);
      
      setFeeCategories([...feeCategories, category]);
      setShowCreateCategory(false);
      setNewCategory({
        name: '',
        description: '',
        isCompulsory: true,
        applicableClasses: [],
        academicYear: '2023/2024'
      });
    } catch (error) {
      console.error('Failed to create category:', error);
      alert('Failed to create fee category');
    }
  };

  const handleCreateFeeStructure = async () => {
    if (!newFeeStructure.categoryId || !newFeeStructure.className || !newFeeStructure.amount) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const structure = await feeManagementService.createFeeStructure({
        ...newFeeStructure,
        schoolId
      } as Omit<FeeStructure, 'id' | 'createdAt' | 'updatedAt'>);
      
      setFeeStructures([...feeStructures, structure]);
      setShowCreateFeeStructure(false);
      setNewFeeStructure({
        categoryId: '',
        className: '',
        amount: 0,
        currency: 'NGN',
        dueDate: '',
        lateFeeAmount: 0,
        lateFeeType: 'fixed',
        allowInstallments: false,
        isActive: true
      });
    } catch (error) {
      console.error('Failed to create fee structure:', error);
      alert('Failed to create fee structure');
    }
  };

  const handleCreateInstallmentPlan = async () => {
    if (!newInstallmentPlan.name || !newInstallmentPlan.numberOfInstallments) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const plan = await feeManagementService.createInstallmentPlan(newInstallmentPlan as Omit<InstallmentPlan, 'id'>);
      setInstallmentPlans([...installmentPlans, plan]);
      setShowCreateInstallment(false);
      setNewInstallmentPlan({
        name: '',
        numberOfInstallments: 3,
        installmentAmounts: [],
        dueDates: [],
        processingFee: 0
      });
    } catch (error) {
      console.error('Failed to create installment plan:', error);
      alert('Failed to create installment plan');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'badge-success';
      case 'partial': return 'badge-warning';
      case 'pending': return 'badge-info';
      case 'overdue': return 'badge-error';
      default: return 'badge-neutral';
    }
  };

  const COLORS = ['#4F46E5', '#059669', '#DC2626', '#F59E0B'];

  // Chart data preparation
  const collectionData = [
    { month: 'Oct', collected: 12000000, target: 15000000 },
    { month: 'Nov', collected: 14500000, target: 15000000 },
    { month: 'Dec', collected: 13800000, target: 15000000 },
    { month: 'Jan', collected: 8500000, target: 15000000 }
  ];

  const paymentStatusData = [
    { name: 'Paid', value: parentFeeRecords.filter(r => r.paymentStatus === 'paid').length, color: '#059669' },
    { name: 'Partial', value: parentFeeRecords.filter(r => r.paymentStatus === 'partial').length, color: '#F59E0B' },
    { name: 'Pending', value: parentFeeRecords.filter(r => r.paymentStatus === 'pending').length, color: '#4F46E5' },
    { name: 'Overdue', value: parentFeeRecords.filter(r => r.paymentStatus === 'overdue').length, color: '#DC2626' }
  ];

  if (loading && !feeMetrics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Fee Management</h1>
          <p className="text-base-content/60">Configure parent payment structures and manage fee collection</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCreateCategory(true)}
            className="btn btn-primary btn-sm"
          >
            Add Category
          </button>
          <button
            onClick={() => setShowCreateFeeStructure(true)}
            className="btn btn-secondary btn-sm"
          >
            Add Fee Structure
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      {feeMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="stat">
                <div className="stat-title">Total Students</div>
                <div className="stat-value text-primary">{feeMetrics.totalStudents}</div>
                <div className="stat-desc">
                  Active enrollments
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="stat">
                <div className="stat-title">Fees Collected</div>
                <div className="stat-value text-success">
                  {formatCurrency(feeMetrics.totalFeesCollected)}
                </div>
                <div className="stat-desc">
                  This month: {formatCurrency(feeMetrics.thisMonthCollection)}
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="stat">
                <div className="stat-title">Outstanding Fees</div>
                <div className="stat-value text-warning">
                  {formatCurrency(feeMetrics.outstandingFees)}
                </div>
                <div className="stat-desc">
                  Collection rate: {feeMetrics.collectionRate}%
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="stat">
                <div className="stat-title">Late Payments</div>
                <div className="stat-value text-error">{feeMetrics.latePayments}</div>
                <div className="stat-desc">
                  Installment plans: {feeMetrics.activeInstallmentPlans}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs tabs-boxed">
        <button
          className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab ${activeTab === 'categories' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          Fee Categories
        </button>
        <button
          className={`tab ${activeTab === 'structures' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('structures')}
        >
          Fee Structures
        </button>
        <button
          className={`tab ${activeTab === 'records' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('records')}
        >
          Parent Fee Records
        </button>
        <button
          className={`tab ${activeTab === 'installments' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('installments')}
        >
          Installment Plans
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Collection Chart */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title">Monthly Collection vs Target</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={collectionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `₦${(value / 1000000).toFixed(1)}M`} />
                  <Tooltip formatter={(value: number) => [formatCurrency(value), '']} />
                  <Bar dataKey="collected" fill="#059669" name="Collected" />
                  <Bar dataKey="target" fill="#E5E7EB" name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Payment Status Distribution */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title">Payment Status Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={paymentStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {paymentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feeCategories.map((category) => (
            <div key={category.id} className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="card-title">{category.name}</h3>
                <p className="text-base-content/60">{category.description}</p>
                <div className="space-y-2 my-4">
                  <div className="flex items-center gap-2">
                    <span className={`badge ${category.isCompulsory ? 'badge-error' : 'badge-info'}`}>
                      {category.isCompulsory ? 'Compulsory' : 'Optional'}
                    </span>
                    <span className="badge badge-outline">{category.academicYear}</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Applicable Classes:</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {category.applicableClasses.map((className, index) => (
                        <span key={index} className="badge badge-ghost badge-sm">
                          {className}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="card-actions justify-end">
                  <button className="btn btn-sm btn-outline">Edit</button>
                  <button className="btn btn-sm btn-error btn-outline">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'structures' && (
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title">Fee Structures</h3>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Class</th>
                    <th>Amount</th>
                    <th>Due Date</th>
                    <th>Late Fee</th>
                    <th>Installments</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {feeStructures.map((structure) => {
                    const category = feeCategories.find(c => c.id === structure.categoryId);
                    return (
                      <tr key={structure.id}>
                        <td>{category?.name || 'Unknown'}</td>
                        <td>{structure.className}</td>
                        <td>{formatCurrency(structure.amount)}</td>
                        <td>{formatDate(structure.dueDate)}</td>
                        <td>
                          {structure.lateFeeType === 'percentage' ? 
                            `${structure.lateFeeAmount}%` : 
                            formatCurrency(structure.lateFeeAmount)
                          }
                        </td>
                        <td>
                          <span className={`badge ${structure.allowInstallments ? 'badge-success' : 'badge-ghost'}`}>
                            {structure.allowInstallments ? 'Allowed' : 'Not Allowed'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${structure.isActive ? 'badge-success' : 'badge-error'}`}>
                            {structure.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <button className="btn btn-sm btn-outline">Edit</button>
                            <button className="btn btn-sm btn-error btn-outline">Delete</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'records' && (
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title">Parent Fee Records</h3>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Academic Year</th>
                    <th>Total Amount</th>
                    <th>Paid Amount</th>
                    <th>Outstanding</th>
                    <th>Status</th>
                    <th>Next Due Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {parentFeeRecords.map((record) => (
                    <tr key={record.id}>
                      <td>Student #{record.studentId}</td>
                      <td>{record.academicYear}</td>
                      <td>{formatCurrency(record.totalAmount)}</td>
                      <td>{formatCurrency(record.paidAmount)}</td>
                      <td>{formatCurrency(record.outstandingAmount)}</td>
                      <td>
                        <span className={`badge ${getPaymentStatusColor(record.paymentStatus)}`}>
                          {record.paymentStatus}
                        </span>
                      </td>
                      <td>{formatDate(record.nextDueDate)}</td>
                      <td>
                        <div className="flex gap-2">
                          <button className="btn btn-sm btn-primary btn-outline">
                            Record Payment
                          </button>
                          <button className="btn btn-sm btn-outline">
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'installments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {installmentPlans.map((plan) => (
            <div key={plan.id} className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="card-title">{plan.name}</h3>
                <div className="space-y-2 my-4">
                  <div className="flex justify-between">
                    <span>Installments:</span>
                    <span className="font-semibold">{plan.numberOfInstallments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing Fee:</span>
                    <span className="font-semibold">{formatCurrency(plan.processingFee)}</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Installment Amounts:</div>
                    <div className="space-y-1 mt-1">
                      {plan.installmentAmounts.map((amount, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>Payment {index + 1}:</span>
                          <span>{formatCurrency(amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="card-actions justify-end">
                  <button className="btn btn-sm btn-outline">Edit</button>
                  <button className="btn btn-sm btn-error btn-outline">Delete</button>
                </div>
              </div>
            </div>
          ))}
          
          {/* Add New Plan Card */}
          <div className="card bg-base-200 border-2 border-dashed border-base-300 shadow-lg">
            <div className="card-body items-center text-center">
              <h3 className="card-title text-base-content/60">Add New Plan</h3>
              <p className="text-base-content/40">Create installment options for parents</p>
              <button
                onClick={() => setShowCreateInstallment(true)}
                className="btn btn-primary btn-outline"
              >
                Create Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Category Modal */}
      {showCreateCategory && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Create Fee Category</h3>
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Category Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="e.g., Tuition Fees"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  className="textarea textarea-bordered"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  placeholder="Describe this fee category"
                />
              </div>

              <div className="form-control">
                <label className="cursor-pointer label">
                  <span className="label-text">Compulsory Fee</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={newCategory.isCompulsory}
                    onChange={(e) => setNewCategory({ ...newCategory, isCompulsory: e.target.checked })}
                  />
                </label>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Academic Year</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={newCategory.academicYear}
                  onChange={(e) => setNewCategory({ ...newCategory, academicYear: e.target.value })}
                  placeholder="2023/2024"
                />
              </div>
            </div>

            <div className="modal-action">
              <button className="btn" onClick={() => setShowCreateCategory(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleCreateCategory}>
                Create Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Fee Structure Modal */}
      {showCreateFeeStructure && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4">Create Fee Structure</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Fee Category</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={newFeeStructure.categoryId}
                    onChange={(e) => setNewFeeStructure({ ...newFeeStructure, categoryId: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    {feeCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Class</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={newFeeStructure.className}
                    onChange={(e) => setNewFeeStructure({ ...newFeeStructure, className: e.target.value })}
                  >
                    <option value="">Select Class</option>
                    {availableClasses.map((className) => (
                      <option key={className} value={className}>
                        {className}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Amount (₦)</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={newFeeStructure.amount}
                    onChange={(e) => setNewFeeStructure({ ...newFeeStructure, amount: Number(e.target.value) })}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Due Date</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered"
                    value={newFeeStructure.dueDate}
                    onChange={(e) => setNewFeeStructure({ ...newFeeStructure, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Late Fee Amount</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={newFeeStructure.lateFeeAmount}
                    onChange={(e) => setNewFeeStructure({ ...newFeeStructure, lateFeeAmount: Number(e.target.value) })}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Late Fee Type</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={newFeeStructure.lateFeeType}
                    onChange={(e) => setNewFeeStructure({ ...newFeeStructure, lateFeeType: e.target.value as 'fixed' | 'percentage' })}
                  >
                    <option value="fixed">Fixed Amount</option>
                    <option value="percentage">Percentage</option>
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label className="cursor-pointer label">
                  <span className="label-text">Allow Installment Payments</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={newFeeStructure.allowInstallments}
                    onChange={(e) => setNewFeeStructure({ ...newFeeStructure, allowInstallments: e.target.checked })}
                  />
                </label>
              </div>
            </div>

            <div className="modal-action">
              <button className="btn" onClick={() => setShowCreateFeeStructure(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleCreateFeeStructure}>
                Create Structure
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Installment Plan Modal */}
      {showCreateInstallment && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Create Installment Plan</h3>
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Plan Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={newInstallmentPlan.name}
                  onChange={(e) => setNewInstallmentPlan({ ...newInstallmentPlan, name: e.target.value })}
                  placeholder="e.g., 3-Month Plan"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Number of Installments</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered"
                  min="2"
                  max="12"
                  value={newInstallmentPlan.numberOfInstallments}
                  onChange={(e) => setNewInstallmentPlan({ ...newInstallmentPlan, numberOfInstallments: Number(e.target.value) })}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Processing Fee (₦)</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered"
                  value={newInstallmentPlan.processingFee}
                  onChange={(e) => setNewInstallmentPlan({ ...newInstallmentPlan, processingFee: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="modal-action">
              <button className="btn" onClick={() => setShowCreateInstallment(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleCreateInstallmentPlan}>
                Create Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolAdminFeeManagement;