// SuperAdmin Billing Dashboard - School Subscription & Payment Management
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import { billingService } from '../services/billingService';
import { 
  SubscriptionPlan, 
  SchoolSubscription, 
  SchoolBillingHistory, 
  SuperAdminDashboardMetrics,
  SchoolUsageMetrics 
} from '../types';

const SuperAdminBillingDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardMetrics, setDashboardMetrics] = useState<SuperAdminDashboardMetrics | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [schoolSubscriptions, setSchoolSubscriptions] = useState<SchoolSubscription[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<SchoolSubscription | null>(null);
  const [billingHistory, setBillingHistory] = useState<SchoolBillingHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [newPlan, setNewPlan] = useState<Partial<SubscriptionPlan>>({
    name: '',
    description: '',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [],
    maxStudents: 0,
    maxStaff: 0,
    isActive: true
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [metrics, plans, subscriptions] = await Promise.all([
        billingService.getSuperAdminDashboardMetrics(),
        billingService.getSubscriptionPlans(),
        billingService.getSchoolSubscriptions()
      ]);

      setDashboardMetrics(metrics);
      setSubscriptionPlans(plans);
      setSchoolSubscriptions(subscriptions);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSchoolBillingHistory = async (schoolId: string) => {
    try {
      const history = await billingService.getSchoolBillingHistory(schoolId);
      setBillingHistory(history);
    } catch (error) {
      console.error('Failed to load billing history:', error);
    }
  };

  const handleCreatePlan = async () => {
    if (!newPlan.name || !newPlan.monthlyPrice) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const plan = await billingService.createSubscriptionPlan(newPlan as Omit<SubscriptionPlan, 'id'>);
      setSubscriptionPlans([...subscriptionPlans, plan]);
      setShowCreatePlan(false);
      setNewPlan({
        name: '',
        description: '',
        monthlyPrice: 0,
        yearlyPrice: 0,
        features: [],
        maxStudents: 0,
        maxStaff: 0,
        isActive: true
      });
    } catch (error) {
      console.error('Failed to create plan:', error);
      alert('Failed to create subscription plan');
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

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'badge-success';
      case 'past_due': return 'badge-warning';
      case 'canceled': return 'badge-error';
      case 'unpaid': return 'badge-error';
      case 'trialing': return 'badge-info';
      default: return 'badge-neutral';
    }
  };

  const COLORS = ['#4F46E5', '#059669', '#DC2626', '#F59E0B', '#8B5CF6'];

  // Chart data preparation
  const revenueData = [
    { month: 'Oct', revenue: 4200000 },
    { month: 'Nov', revenue: 4650000 },
    { month: 'Dec', revenue: 4850000 },
    { month: 'Jan', revenue: 4850000 }
  ];

  const planDistribution = subscriptionPlans.map((plan, index) => ({
    name: plan.name,
    value: schoolSubscriptions.filter(sub => sub.planId === plan.id).length,
    color: COLORS[index % COLORS.length]
  }));

  if (loading && !dashboardMetrics) {
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
          <h1 className="text-3xl font-bold">SuperAdmin Billing Dashboard</h1>
          <p className="text-base-content/60">Manage school subscriptions and platform billing</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCreatePlan(true)}
            className="btn btn-primary"
          >
            Create Plan
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      {dashboardMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="stat">
                <div className="stat-title">Total Schools</div>
                <div className="stat-value text-primary">{dashboardMetrics.totalSchools}</div>
                <div className="stat-desc">
                  +{dashboardMetrics.newSchoolsThisMonth} this month
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="stat">
                <div className="stat-title">Monthly Recurring Revenue</div>
                <div className="stat-value text-success">
                  {formatCurrency(dashboardMetrics.monthlyRecurringRevenue)}
                </div>
                <div className="stat-desc">
                  Avg per school: {formatCurrency(dashboardMetrics.averageRevenuePerSchool)}
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="stat">
                <div className="stat-title">Active Subscriptions</div>
                <div className="stat-value">{dashboardMetrics.activeSubscriptions}</div>
                <div className="stat-desc">
                  Churn rate: {dashboardMetrics.churnRate}%
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="stat">
                <div className="stat-title">Total Revenue</div>
                <div className="stat-value text-info">
                  {formatCurrency(dashboardMetrics.totalRevenue)}
                </div>
                <div className="stat-desc">
                  -{dashboardMetrics.canceledSubscriptionsThisMonth} canceled this month
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
          className={`tab ${activeTab === 'subscriptions' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('subscriptions')}
        >
          School Subscriptions
        </button>
        <button
          className={`tab ${activeTab === 'plans' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('plans')}
        >
          Subscription Plans
        </button>
        <button
          className={`tab ${activeTab === 'billing' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('billing')}
        >
          Billing History
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title">Monthly Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `₦${(value / 1000000).toFixed(1)}M`} />
                  <Tooltip formatter={(value: number) => [formatCurrency(value), 'Revenue']} />
                  <Line type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Plan Distribution */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title">Plan Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={planDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {planDistribution.map((entry, index) => (
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

      {activeTab === 'subscriptions' && (
        <div className="grid grid-cols-1 gap-6">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title">School Subscriptions</h3>
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>School</th>
                      <th>Plan</th>
                      <th>Status</th>
                      <th>Monthly Revenue</th>
                      <th>Current Period</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schoolSubscriptions.map((subscription) => {
                      const plan = subscriptionPlans.find(p => p.id === subscription.planId);
                      return (
                        <tr key={subscription.id}>
                          <td>
                            <div className="font-semibold">School #{subscription.schoolId}</div>
                          </td>
                          <td>{plan?.name || 'Unknown Plan'}</td>
                          <td>
                            <span className={`badge ${getStatusBadgeColor(subscription.status)}`}>
                              {subscription.status}
                            </span>
                          </td>
                          <td>{formatCurrency(subscription.monthlyRevenue)}</td>
                          <td>
                            <div className="text-sm">
                              {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
                            </div>
                          </td>
                          <td>
                            <div className="flex gap-2">
                              <button
                                className="btn btn-sm btn-outline"
                                onClick={() => {
                                  setSelectedSchool(subscription);
                                  loadSchoolBillingHistory(subscription.schoolId);
                                }}
                              >
                                View Details
                              </button>
                              {subscription.status === 'active' && (
                                <button className="btn btn-sm btn-error btn-outline">
                                  Cancel
                                </button>
                              )}
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
        </div>
      )}

      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptionPlans.map((plan) => (
            <div key={plan.id} className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="card-title">{plan.name}</h3>
                <p className="text-base-content/60">{plan.description}</p>
                <div className="space-y-2 my-4">
                  <div className="flex justify-between">
                    <span>Monthly:</span>
                    <span className="font-semibold">{formatCurrency(plan.monthlyPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Yearly:</span>
                    <span className="font-semibold">{formatCurrency(plan.yearlyPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Students:</span>
                    <span>{plan.maxStudents === -1 ? 'Unlimited' : plan.maxStudents}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Staff:</span>
                    <span>{plan.maxStaff === -1 ? 'Unlimited' : plan.maxStaff}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-semibold">Features:</div>
                  <ul className="text-sm space-y-1">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="text-success">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="card-actions justify-end mt-4">
                  <div className="text-sm">
                    Active: {schoolSubscriptions.filter(sub => sub.planId === plan.id).length} schools
                  </div>
                  <button className="btn btn-sm btn-outline">Edit</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'billing' && selectedSchool && (
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title">
              Billing History - School #{selectedSchool.schoolId}
            </h3>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Payment Method</th>
                    <th>Paid At</th>
                  </tr>
                </thead>
                <tbody>
                  {billingHistory.map((bill) => (
                    <tr key={bill.id}>
                      <td>{formatDate(bill.billingDate)}</td>
                      <td>{bill.description}</td>
                      <td>{formatCurrency(bill.amount)}</td>
                      <td>
                        <span className={`badge ${bill.status === 'paid' ? 'badge-success' : 
                                                   bill.status === 'pending' ? 'badge-warning' : 'badge-error'}`}>
                          {bill.status}
                        </span>
                      </td>
                      <td className="capitalize">{bill.paymentMethod}</td>
                      <td>{bill.paidAt ? formatDate(bill.paidAt) : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Create Plan Modal */}
      {showCreatePlan && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4">Create New Subscription Plan</h3>
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Plan Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={newPlan.name}
                  onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                  placeholder="e.g., Premium Plan"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  className="textarea textarea-bordered"
                  value={newPlan.description}
                  onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                  placeholder="Describe the plan features and target audience"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Monthly Price (₦)</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={newPlan.monthlyPrice}
                    onChange={(e) => setNewPlan({ ...newPlan, monthlyPrice: Number(e.target.value) })}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Yearly Price (₦)</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={newPlan.yearlyPrice}
                    onChange={(e) => setNewPlan({ ...newPlan, yearlyPrice: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Max Students (-1 for unlimited)</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={newPlan.maxStudents}
                    onChange={(e) => setNewPlan({ ...newPlan, maxStudents: Number(e.target.value) })}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Max Staff (-1 for unlimited)</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={newPlan.maxStaff}
                    onChange={(e) => setNewPlan({ ...newPlan, maxStaff: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>

            <div className="modal-action">
              <button className="btn" onClick={() => setShowCreatePlan(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleCreatePlan}>
                Create Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminBillingDashboard;