import React, { useState, useEffect } from 'react';
import { CurrentUser, School, StaffPortalData, Student, Payment } from '../types';
import { getStaffPortalData, recordPayment } from '../services/dataService';

interface StaffDashboardProps {
  school: School;
  currentUser: CurrentUser;
  onLogout: () => void;
  refreshData: () => void;
}

type StaffTab = 'lookup' | 'payment' | 'receipts' | 'reports' | 'communications' | 'fees';

const StaffDashboard: React.FC<StaffDashboardProps> = ({ 
  school, 
  currentUser, 
  onLogout, 
  refreshData 
}) => {
  const [activeTab, setActiveTab] = useState<StaffTab>('lookup');
  const [staffData, setStaffData] = useState<StaffPortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    studentId: '',
    amount: '',
    method: 'cash' as 'cash' | 'bank_transfer' | 'card',
    description: '',
    reference: ''
  });
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    loadStaffData();
  }, [currentUser]);

  const loadStaffData = async () => {
    try {
      setLoading(true);
      const data = await getStaffPortalData(currentUser);
      setStaffData(data);
    } catch (error) {
      console.error('Failed to load staff portal data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentLoading(true);
    
    try {
      await recordPayment(currentUser, {
        studentId: paymentForm.studentId,
        amount: parseFloat(paymentForm.amount),
        method: paymentForm.method,
        description: paymentForm.description,
        reference: paymentForm.reference
      });
      
      setPaymentForm({
        studentId: '',
        amount: '',
        method: 'cash',
        description: '',
        reference: ''
      });
      
      setSelectedStudent(null);
      await loadStaffData();
      refreshData();
    } catch (error) {
      console.error('Payment recording failed:', error);
    } finally {
      setPaymentLoading(false);
    }
  };

  const selectStudentForPayment = (student: Student) => {
    setSelectedStudent(student);
    setPaymentForm({
      ...paymentForm,
      studentId: student.id,
      amount: student.outstandingFees.toString(),
      description: 'Fee payment'
    });
    setActiveTab('payment');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const filteredStudents = school.students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.class.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  const renderLookupTab = () => (
    <div className="space-y-6">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h3 className="card-title text-primary mb-4">Student Lookup</h3>
          
          <div className="form-control mb-4">
            <input 
              type="text"
              placeholder="Search by name, admission number, or class..."
              className="input input-bordered w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Admission #</th>
                  <th>Student Name</th>
                  <th>Class</th>
                  <th>Outstanding Fees</th>
                  <th>Parent</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.slice(0, 20).map((student) => (
                  <tr key={student.id}>
                    <td className="font-mono">{student.admissionNumber}</td>
                    <td className="font-semibold">{student.name}</td>
                    <td>{student.class}</td>
                    <td>
                      <span className={`font-bold ${student.outstandingFees > 0 ? 'text-error' : 'text-success'}`}>
                        {formatCurrency(student.outstandingFees)}
                      </span>
                    </td>
                    <td>
                      <div className="text-sm">
                        <p>{student.parentName}</p>
                        <p className="text-base-content/70">{student.parentPhone}</p>
                      </div>
                    </td>
                    <td>
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => selectStudentForPayment(student)}
                        disabled={student.outstandingFees === 0}
                      >
                        {student.outstandingFees > 0 ? 'Collect Payment' : 'No Outstanding'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentTab = () => (
    <div className="space-y-6">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h3 className="card-title text-primary mb-4">Collect Payment</h3>
          
          {selectedStudent && (
            <div className="alert alert-info mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="font-bold">Selected Student: {selectedStudent.name}</h4>
                <p>Class: {selectedStudent.class} • Outstanding: {formatCurrency(selectedStudent.outstandingFees)}</p>
              </div>
            </div>
          )}
          
          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text">Student</span>
                </label>
                <select 
                  className="select select-bordered w-full"
                  value={paymentForm.studentId}
                  onChange={(e) => {
                    const student = school.students.find(s => s.id === e.target.value);
                    setPaymentForm({...paymentForm, studentId: e.target.value});
                    setSelectedStudent(student || null);
                  }}
                  required
                >
                  <option value="">Select a student</option>
                  {school.students.filter(s => s.outstandingFees > 0).map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} ({student.admissionNumber}) - {formatCurrency(student.outstandingFees)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="label">
                  <span className="label-text">Amount (₦)</span>
                </label>
                <input 
                  type="number"
                  className="input input-bordered w-full"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div>
                <label className="label">
                  <span className="label-text">Payment Method</span>
                </label>
                <select 
                  className="select select-bordered w-full"
                  value={paymentForm.method}
                  onChange={(e) => setPaymentForm({...paymentForm, method: e.target.value as any})}
                >
                  <option value="cash">Cash</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="card">Card/POS</option>
                </select>
              </div>
              
              <div>
                <label className="label">
                  <span className="label-text">Reference (Optional)</span>
                </label>
                <input 
                  type="text"
                  className="input input-bordered w-full"
                  value={paymentForm.reference}
                  onChange={(e) => setPaymentForm({...paymentForm, reference: e.target.value})}
                  placeholder="Transaction reference"
                />
              </div>
            </div>
            
            <div>
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <input 
                type="text"
                className="input input-bordered w-full"
                value={paymentForm.description}
                onChange={(e) => setPaymentForm({...paymentForm, description: e.target.value})}
                placeholder="e.g., Tuition fee, Book fee, etc."
                required
              />
            </div>
            
            <div className="flex justify-end">
              <button 
                type="submit" 
                className={`btn btn-primary ${paymentLoading ? 'loading' : ''}`}
                disabled={paymentLoading}
              >
                {paymentLoading ? 'Recording...' : 'Record Payment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const renderReceiptsTab = () => (
    <div className="space-y-6">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h3 className="card-title text-primary">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Student</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffData?.recentTransactions.map((transaction) => {
                  const student = school.students.find(s => s.id === transaction.studentId);
                  return (
                    <tr key={transaction.id}>
                      <td>{new Date(transaction.date).toLocaleDateString()}</td>
                      <td>{student?.name}</td>
                      <td className="font-bold">{formatCurrency(transaction.amount)}</td>
                      <td>
                        <div className="badge badge-outline">{transaction.method}</div>
                      </td>
                      <td>{transaction.description}</td>
                      <td>
                        <button className="btn btn-ghost btn-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                          </svg>
                          Print
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReportsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat bg-base-100 shadow-lg rounded-lg">
          <div className="stat-figure text-primary">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div className="stat-title">Today's Collections</div>
          <div className="stat-value text-primary">{formatCurrency(staffData?.dailyCollections || 0)}</div>
        </div>

        <div className="stat bg-base-100 shadow-lg rounded-lg">
          <div className="stat-figure text-error">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="stat-title">Pending Payments</div>
          <div className="stat-value text-error">{staffData?.pendingPayments.length || 0}</div>
        </div>

        <div className="stat bg-base-100 shadow-lg rounded-lg">
          <div className="stat-figure text-success">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div className="stat-title">Transactions Today</div>
          <div className="stat-value text-success">{staffData?.recentTransactions.filter(t => {
            const today = new Date().toDateString();
            const transactionDate = new Date(t.date).toDateString();
            return today === transactionDate;
          }).length || 0}</div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h3 className="card-title text-primary">Generate Reports</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="btn btn-outline">Daily Collection Report</button>
            <button className="btn btn-outline">Outstanding Fees Report</button>
            <button className="btn btn-outline">Payment History Report</button>
            <button className="btn btn-outline">Student Status Report</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCommunicationsTab = () => (
    <div className="space-y-6">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h3 className="card-title text-primary">Communications</h3>
          <div className="text-center py-8">
            <svg className="w-16 h-16 mx-auto text-base-content/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-base-content/60">Communication tools coming soon!</p>
            <p className="text-sm text-base-content/40">SMS and email templates for payment reminders and notifications.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFeesTab = () => (
    <div className="space-y-6">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h3 className="card-title text-primary">Fee Structure</h3>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Fee Type</th>
                  <th>Class</th>
                  <th>Amount</th>
                  <th>Term</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {staffData?.feeStructure.map((fee) => (
                  fee.amounts.map((feeAmount, index) => (
                    <tr key={`${fee.id}-${index}`}>
                      <td className="font-semibold">{fee.name}</td>
                      <td>{feeAmount.class}</td>
                      <td className="font-bold">{formatCurrency(feeAmount.amount)}</td>
                      <td className="capitalize">{feeAmount.type}</td>
                      <td>
                        <div className="badge badge-success">
                          Active
                        </div>
                      </td>
                    </tr>
                  ))
                )).flat()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <span className="btn btn-ghost text-xl font-bold">
            {school?.name} - Staff Portal
          </span>
        </div>
        <div className="flex-none">
          <span className="mr-4 text-sm">Welcome, {currentUser?.name}!</span>
          <button className="btn btn-outline" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="container mx-auto px-4 pt-6">
        <div className="tabs tabs-boxed bg-base-100 shadow-lg mb-6">
          <button 
            className={`tab ${activeTab === 'lookup' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('lookup')}
          >
            Student Lookup
          </button>
          <button 
            className={`tab ${activeTab === 'payment' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('payment')}
          >
            Collect Payment
          </button>
          <button 
            className={`tab ${activeTab === 'receipts' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('receipts')}
          >
            Receipts
          </button>
          <button 
            className={`tab ${activeTab === 'reports' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </button>
          <button 
            className={`tab ${activeTab === 'communications' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('communications')}
          >
            Communications
          </button>
          <button 
            className={`tab ${activeTab === 'fees' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('fees')}
          >
            Fee Structure
          </button>
        </div>

        {/* Tab Content */}
        <div className="pb-8">
          {activeTab === 'lookup' && renderLookupTab()}
          {activeTab === 'payment' && renderPaymentTab()}
          {activeTab === 'receipts' && renderReceiptsTab()}
          {activeTab === 'reports' && renderReportsTab()}
          {activeTab === 'communications' && renderCommunicationsTab()}
          {activeTab === 'fees' && renderFeesTab()}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;