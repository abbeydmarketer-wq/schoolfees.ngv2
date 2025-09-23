import React, { useState, useEffect } from 'react';
import { CurrentUser, School, ParentPortalData, Student, Payment } from '../types';
import { getParentPortalData, createPaymentIntent, confirmPayment } from '../services/dataService';

interface ParentDashboardProps {
  school: School;
  currentUser: CurrentUser;
  onLogout: () => void;
  refreshData: () => void;
}

type ParentTab = 'overview' | 'fees' | 'receipts' | 'academics' | 'messages' | 'profile';

const ParentDashboard: React.FC<ParentDashboardProps> = ({ 
  school, 
  currentUser, 
  onLogout, 
  refreshData 
}) => {
  const [activeTab, setActiveTab] = useState<ParentTab>('overview');
  const [portalData, setPortalData] = useState<ParentPortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);

  useEffect(() => {
    loadPortalData();
  }, [currentUser]);

  const loadPortalData = async () => {
    try {
      setLoading(true);
      const data = await getParentPortalData(currentUser);
      setPortalData(data);
    } catch (error) {
      console.error('Failed to load parent portal data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (studentId: string, amount: number) => {
    try {
      setPaymentLoading(studentId);
      const { paymentUrl, reference } = await createPaymentIntent(currentUser, amount, studentId);
      
      // In a real implementation, this would open the payment gateway
      // For now, simulate a successful payment
      window.open(paymentUrl, '_blank');
      
      // Mock payment confirmation after 3 seconds
      setTimeout(async () => {
        await confirmPayment(reference, { status: 'success' });
        await loadPortalData();
        refreshData();
        setPaymentLoading(null);
      }, 3000);
      
    } catch (error) {
      console.error('Payment failed:', error);
      setPaymentLoading(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  const renderOverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat bg-base-100 shadow-lg rounded-lg">
          <div className="stat-figure text-primary">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <div className="stat-title">Children Enrolled</div>
          <div className="stat-value text-primary">{portalData?.children.length || 0}</div>
        </div>

        <div className="stat bg-base-100 shadow-lg rounded-lg">
          <div className="stat-figure text-error">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div className="stat-title">Outstanding Fees</div>
          <div className="stat-value text-error">{formatCurrency(portalData?.totalOutstandingFees || 0)}</div>
        </div>

        <div className="stat bg-base-100 shadow-lg rounded-lg">
          <div className="stat-figure text-success">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div className="stat-title">Recent Payments</div>
          <div className="stat-value text-success">{portalData?.recentPayments.length || 0}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title text-primary">Your Children</h3>
            <div className="space-y-3">
              {portalData?.children.map((child) => (
                <div key={child.id} className="flex items-center justify-between p-3 border border-base-300 rounded-lg">
                  <div>
                    <p className="font-semibold">{child.name}</p>
                    <p className="text-sm text-base-content/70">{child.class} • {child.admissionNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${child.outstandingFees > 0 ? 'text-error' : 'text-success'}`}>
                      {child.outstandingFees > 0 ? formatCurrency(child.outstandingFees) : 'Paid'}
                    </p>
                    <div className={`badge ${child.outstandingFees > 0 ? 'badge-error' : 'badge-success'}`}>
                      {child.outstandingFees > 0 ? 'Outstanding' : 'Current'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title text-primary">Recent Payments</h3>
            <div className="space-y-3">
              {portalData?.recentPayments.slice(0, 5).map((payment) => {
                const child = portalData?.children.find(c => c.id === payment.studentId);
                return (
                  <div key={payment.id} className="flex items-center justify-between p-3 border border-base-300 rounded-lg">
                    <div>
                      <p className="font-semibold">{child?.name}</p>
                      <p className="text-sm text-base-content/70">{payment.description}</p>
                      <p className="text-xs text-base-content/50">{new Date(payment.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-success">{formatCurrency(payment.amount)}</p>
                      <div className="badge badge-success badge-sm">Paid</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFeesTab = () => (
    <div className="space-y-6">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h3 className="card-title text-primary">Outstanding Fees</h3>
          <div className="space-y-4">
            {portalData?.children.filter(child => child.outstandingFees > 0).map((child) => (
              <div key={child.id} className="border border-base-300 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-lg">{child.name}</h4>
                    <p className="text-base-content/70">{child.class} • {child.admissionNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-error">{formatCurrency(child.outstandingFees)}</p>
                    <button 
                      className={`btn btn-primary btn-sm ${paymentLoading === child.id ? 'loading' : ''}`}
                      onClick={() => handlePayment(child.id, child.outstandingFees)}
                      disabled={paymentLoading === child.id}
                    >
                      {paymentLoading === child.id ? 'Processing...' : 'Pay Now'}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {child.fees?.filter(fee => fee.status !== 'paid').map((fee) => (
                    <div key={fee.id} className="flex items-center justify-between py-2 px-3 bg-base-200 rounded">
                      <div>
                        <p className="font-semibold">{fee.type}</p>
                        <p className="text-sm text-base-content/70">{fee.session} - {fee.term} term</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(fee.amount - fee.paidAmount)}</p>
                        <div className={`badge ${fee.status === 'overdue' ? 'badge-error' : 'badge-warning'}`}>
                          {fee.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderReceiptsTab = () => (
    <div className="space-y-6">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h3 className="card-title text-primary">Payment Receipts</h3>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Receipt #</th>
                  <th>Student</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Method</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {portalData?.receipts.map((receipt) => (
                  <tr key={receipt.id}>
                    <td className="font-mono">{receipt.receiptNumber}</td>
                    <td>{receipt.studentName}</td>
                    <td className="font-bold">{formatCurrency(receipt.amount)}</td>
                    <td>{new Date(receipt.issueDate).toLocaleDateString()}</td>
                    <td>
                      <div className="badge badge-outline">{receipt.paymentMethod}</div>
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download
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

  const renderAcademicsTab = () => (
    <div className="space-y-6">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h3 className="card-title text-primary">Academic Progress</h3>
          <div className="space-y-4">
            {portalData?.children.map((child) => (
              <div key={child.id} className="border border-base-300 rounded-lg p-4">
                <h4 className="font-bold text-lg mb-3">{child.name} - {child.class}</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="stat bg-base-200 rounded">
                    <div className="stat-title">Current Session</div>
                    <div className="stat-value text-lg">{school.currentSession}</div>
                  </div>
                  <div className="stat bg-base-200 rounded">
                    <div className="stat-title">Current Term</div>
                    <div className="stat-value text-lg capitalize">{school.currentTerm}</div>
                  </div>
                  <div className="stat bg-base-200 rounded">
                    <div className="stat-title">Status</div>
                    <div className="stat-value text-lg text-success">Active</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMessagesTab = () => (
    <div className="space-y-6">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h3 className="card-title text-primary">Messages</h3>
          <div className="text-center py-8">
            <svg className="w-16 h-16 mx-auto text-base-content/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-base-content/60">Messaging system coming soon!</p>
            <p className="text-sm text-base-content/40">You'll be able to communicate with teachers and school administration here.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h3 className="card-title text-primary">Parent Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input type="text" className="input input-bordered w-full" value={currentUser.name} readOnly />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Email Address</span>
              </label>
              <input type="email" className="input input-bordered w-full" value={currentUser.email} readOnly />
            </div>
          </div>
          
          <div className="divider">Children Information</div>
          
          <div className="space-y-4">
            {portalData?.children.map((child) => (
              <div key={child.id} className="border border-base-300 rounded-lg p-4">
                <h4 className="font-bold mb-2">{child.name}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-base-content/70">Admission Number:</span>
                    <p className="font-semibold">{child.admissionNumber}</p>
                  </div>
                  <div>
                    <span className="text-base-content/70">Class:</span>
                    <p className="font-semibold">{child.class}</p>
                  </div>
                  <div>
                    <span className="text-base-content/70">Date of Birth:</span>
                    <p className="font-semibold">{new Date(child.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
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
            {school?.name} - Parent Portal
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
            className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'fees' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('fees')}
          >
            Fees & Payments
          </button>
          <button 
            className={`tab ${activeTab === 'receipts' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('receipts')}
          >
            Receipts
          </button>
          <button 
            className={`tab ${activeTab === 'academics' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('academics')}
          >
            Academics
          </button>
          <button 
            className={`tab ${activeTab === 'messages' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            Messages
          </button>
          <button 
            className={`tab ${activeTab === 'profile' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
        </div>

        {/* Tab Content */}
        <div className="pb-8">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'fees' && renderFeesTab()}
          {activeTab === 'receipts' && renderReceiptsTab()}
          {activeTab === 'academics' && renderAcademicsTab()}
          {activeTab === 'messages' && renderMessagesTab()}
          {activeTab === 'profile' && renderProfileTab()}
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;