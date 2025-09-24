// SuperAdmin School Billing Service - Referenced from Stripe integration blueprint
import { getSupabase } from '../supabaseClient';
import { 
  SubscriptionPlan, 
  SchoolSubscription, 
  SchoolBillingHistory, 
  SchoolUsageMetrics,
  SuperAdminDashboardMetrics
} from '../types';

class BillingService {
  private defaultPlans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Basic Plan',
      description: 'Perfect for small schools up to 500 students',
      monthlyPrice: 50000, // ₦50,000 monthly
      yearlyPrice: 500000, // ₦500,000 yearly (2 months free)
      features: [
        'Up to 500 students',
        'Up to 20 staff members',
        'Basic payment processing',
        'Standard reporting',
        'Email support'
      ],
      maxStudents: 500,
      maxStaff: 20,
      isActive: true
    },
    {
      id: 'professional',
      name: 'Professional Plan',
      description: 'Ideal for medium schools up to 1,500 students',
      monthlyPrice: 120000, // ₦120,000 monthly
      yearlyPrice: 1200000, // ₦1,200,000 yearly (2 months free)
      features: [
        'Up to 1,500 students',
        'Up to 50 staff members',
        'Advanced payment processing',
        'AI-powered insights',
        'Priority support',
        'Custom reports',
        'SMS notifications'
      ],
      maxStudents: 1500,
      maxStaff: 50,
      isActive: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      description: 'Complete solution for large institutions',
      monthlyPrice: 300000, // ₦300,000 monthly
      yearlyPrice: 3000000, // ₦3,000,000 yearly (2 months free)
      features: [
        'Unlimited students',
        'Unlimited staff members',
        'Full payment gateway integration',
        'Advanced AI analytics',
        'Dedicated support',
        'Custom integrations',
        'White-label solution',
        'Multi-campus support'
      ],
      maxStudents: -1, // Unlimited
      maxStaff: -1, // Unlimited
      isActive: true
    }
  ];

  // Subscription Plans Management
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    const supabase = getSupabase();
    
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('isActive', true)
          .order('monthlyPrice');
        
        if (error) throw error;
        return data || this.defaultPlans;
      } catch (error) {
        console.warn('Failed to load subscription plans from database:', error);
      }
    }
    
    return this.defaultPlans;
  }

  async createSubscriptionPlan(plan: Omit<SubscriptionPlan, 'id'>): Promise<SubscriptionPlan> {
    const newPlan: SubscriptionPlan = {
      ...plan,
      id: Date.now().toString()
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('subscription_plans')
          .insert([newPlan])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.warn('Failed to create subscription plan in database:', error);
      }
    }

    return newPlan;
  }

  async updateSubscriptionPlan(planId: string, updates: Partial<SubscriptionPlan>): Promise<SubscriptionPlan | null> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('subscription_plans')
          .update(updates)
          .eq('id', planId)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.warn('Failed to update subscription plan:', error);
      }
    }

    return null;
  }

  // School Subscriptions Management
  async getSchoolSubscriptions(): Promise<SchoolSubscription[]> {
    const supabase = getSupabase();
    
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('school_subscriptions')
          .select(`
            *,
            schools (
              name,
              email,
              phone
            ),
            subscription_plans (
              name,
              monthlyPrice
            )
          `)
          .order('createdAt', { ascending: false });
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.warn('Failed to load school subscriptions:', error);
      }
    }

    return this.getMockSchoolSubscriptions();
  }

  async getSchoolSubscription(schoolId: string): Promise<SchoolSubscription | null> {
    const supabase = getSupabase();
    
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('school_subscriptions')
          .select('*')
          .eq('schoolId', schoolId)
          .eq('status', 'active')
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.warn('Failed to load school subscription:', error);
      }
    }

    return this.getMockSchoolSubscriptions().find(sub => sub.schoolId === schoolId) || null;
  }

  async createSchoolSubscription(subscription: Omit<SchoolSubscription, 'id' | 'createdAt' | 'updatedAt'>): Promise<SchoolSubscription> {
    const newSubscription: SchoolSubscription = {
      ...subscription,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('school_subscriptions')
          .insert([newSubscription])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.warn('Failed to create school subscription:', error);
      }
    }

    return newSubscription;
  }

  async updateSchoolSubscription(subscriptionId: string, updates: Partial<SchoolSubscription>): Promise<SchoolSubscription | null> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('school_subscriptions')
          .update({ ...updates, updatedAt: new Date().toISOString() })
          .eq('id', subscriptionId)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.warn('Failed to update school subscription:', error);
      }
    }

    return null;
  }

  // Billing History Management
  async getSchoolBillingHistory(schoolId: string): Promise<SchoolBillingHistory[]> {
    const supabase = getSupabase();
    
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('school_billing_history')
          .select('*')
          .eq('schoolId', schoolId)
          .order('billingDate', { ascending: false });
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.warn('Failed to load billing history:', error);
      }
    }

    return this.getMockBillingHistory().filter(bill => bill.schoolId === schoolId);
  }

  async createBillingRecord(billing: Omit<SchoolBillingHistory, 'id'>): Promise<SchoolBillingHistory> {
    const newBilling: SchoolBillingHistory = {
      ...billing,
      id: Date.now().toString()
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('school_billing_history')
          .insert([newBilling])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.warn('Failed to create billing record:', error);
      }
    }

    return newBilling;
  }

  // Usage Metrics
  async getSchoolUsageMetrics(schoolId: string): Promise<SchoolUsageMetrics | null> {
    const supabase = getSupabase();
    
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('school_usage_metrics')
          .select('*')
          .eq('schoolId', schoolId)
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.warn('Failed to load usage metrics:', error);
      }
    }

    return this.getMockUsageMetrics().find(metrics => metrics.schoolId === schoolId) || null;
  }

  // Dashboard Analytics
  async getSuperAdminDashboardMetrics(): Promise<SuperAdminDashboardMetrics> {
    const supabase = getSupabase();
    
    if (supabase) {
      try {
        // This would typically be a complex query or multiple queries
        // For now, return mock data
        return this.getMockSuperAdminMetrics();
      } catch (error) {
        console.warn('Failed to load dashboard metrics:', error);
      }
    }

    return this.getMockSuperAdminMetrics();
  }

  // Stripe Integration Methods (based on integration blueprint)
  async createStripePaymentIntent(amount: number, schoolId: string): Promise<{ clientSecret: string }> {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          metadata: { schoolId }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const data = await response.json();
      return { clientSecret: data.clientSecret };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  async createStripeSubscription(schoolId: string, planId: string): Promise<{ clientSecret: string }> {
    try {
      const response = await fetch('/api/get-or-create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          schoolId,
          planId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create subscription');
      }

      const data = await response.json();
      return { clientSecret: data.clientSecret };
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  // Mock Data Methods (for offline/demo mode)
  private getMockSchoolSubscriptions(): SchoolSubscription[] {
    return [
      {
        id: 'sub_1',
        schoolId: 'school_1',
        planId: 'professional',
        status: 'active',
        currentPeriodStart: '2024-01-01T00:00:00Z',
        currentPeriodEnd: '2024-02-01T00:00:00Z',
        cancelAtPeriodEnd: false,
        monthlyRevenue: 120000,
        totalRevenue: 1440000,
        createdAt: '2023-01-15T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'sub_2',
        schoolId: 'school_2',
        planId: 'basic',
        status: 'active',
        currentPeriodStart: '2024-01-01T00:00:00Z',
        currentPeriodEnd: '2024-02-01T00:00:00Z',
        cancelAtPeriodEnd: false,
        monthlyRevenue: 50000,
        totalRevenue: 300000,
        createdAt: '2023-08-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ];
  }

  private getMockBillingHistory(): SchoolBillingHistory[] {
    return [
      {
        id: 'bill_1',
        schoolId: 'school_1',
        subscriptionId: 'sub_1',
        amount: 120000,
        currency: 'NGN',
        status: 'paid',
        billingDate: '2024-01-01T00:00:00Z',
        paidAt: '2024-01-01T10:30:00Z',
        description: 'Professional Plan - January 2024',
        paymentMethod: 'stripe'
      },
      {
        id: 'bill_2',
        schoolId: 'school_2',
        subscriptionId: 'sub_2',
        amount: 50000,
        currency: 'NGN',
        status: 'paid',
        billingDate: '2024-01-01T00:00:00Z',
        paidAt: '2024-01-01T14:15:00Z',
        description: 'Basic Plan - January 2024',
        paymentMethod: 'stripe'
      }
    ];
  }

  private getMockUsageMetrics(): SchoolUsageMetrics[] {
    return [
      {
        schoolId: 'school_1',
        currentStudents: 1200,
        currentStaff: 35,
        monthlyTransactions: 450,
        storageUsed: 2500,
        apiCallsUsed: 8500,
        lastUpdated: new Date().toISOString()
      },
      {
        schoolId: 'school_2',
        currentStudents: 350,
        currentStaff: 15,
        monthlyTransactions: 125,
        storageUsed: 850,
        apiCallsUsed: 2100,
        lastUpdated: new Date().toISOString()
      }
    ];
  }

  private getMockSuperAdminMetrics(): SuperAdminDashboardMetrics {
    return {
      totalSchools: 45,
      activeSubscriptions: 42,
      monthlyRecurringRevenue: 4850000,
      totalRevenue: 52500000,
      churnRate: 3.2,
      averageRevenuePerSchool: 115476,
      newSchoolsThisMonth: 8,
      canceledSubscriptionsThisMonth: 2
    };
  }
}

export const billingService = new BillingService();