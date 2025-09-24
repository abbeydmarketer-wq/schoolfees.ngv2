// School Admin Fee Management Service - Referenced from Stripe integration blueprint
import { getSupabase } from '../supabaseClient';
import { 
  FeeCategory, 
  FeeStructure, 
  InstallmentPlan, 
  FeeDiscount,
  ParentFeeRecord,
  FeePaymentTransaction,
  SchoolAdminFeeMetrics
} from '../types';

class FeeManagementService {
  // Fee Categories Management
  async getFeeCategories(schoolId: string): Promise<FeeCategory[]> {
    const supabase = getSupabase();
    
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('fee_categories')
          .select('*')
          .eq('schoolId', schoolId)
          .order('name');
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.warn('Failed to load fee categories:', error);
      }
    }

    return this.getMockFeeCategories(schoolId);
  }

  async createFeeCategory(category: Omit<FeeCategory, 'id' | 'createdAt' | 'updatedAt'>): Promise<FeeCategory> {
    const newCategory: FeeCategory = {
      ...category,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('fee_categories')
          .insert([newCategory])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.warn('Failed to create fee category:', error);
      }
    }

    return newCategory;
  }

  async updateFeeCategory(categoryId: string, updates: Partial<FeeCategory>): Promise<FeeCategory | null> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('fee_categories')
          .update({ ...updates, updatedAt: new Date().toISOString() })
          .eq('id', categoryId)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.warn('Failed to update fee category:', error);
      }
    }

    return null;
  }

  async deleteFeeCategory(categoryId: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error } = await supabase
          .from('fee_categories')
          .delete()
          .eq('id', categoryId);
        
        if (error) throw error;
        return true;
      } catch (error) {
        console.warn('Failed to delete fee category:', error);
      }
    }

    return false;
  }

  // Fee Structure Management
  async getFeeStructures(schoolId: string, academicYear?: string): Promise<FeeStructure[]> {
    const supabase = getSupabase();
    
    if (supabase) {
      try {
        let query = supabase
          .from('fee_structures')
          .select(`
            *,
            fee_categories (
              name,
              description
            )
          `)
          .eq('schoolId', schoolId)
          .eq('isActive', true);

        if (academicYear) {
          query = query.eq('academicYear', academicYear);
        }

        const { data, error } = await query.order('className');
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.warn('Failed to load fee structures:', error);
      }
    }

    return this.getMockFeeStructures(schoolId);
  }

  async createFeeStructure(structure: Omit<FeeStructure, 'id' | 'createdAt' | 'updatedAt'>): Promise<FeeStructure> {
    const newStructure: FeeStructure = {
      ...structure,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('fee_structures')
          .insert([newStructure])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.warn('Failed to create fee structure:', error);
      }
    }

    return newStructure;
  }

  async updateFeeStructure(structureId: string, updates: Partial<FeeStructure>): Promise<FeeStructure | null> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('fee_structures')
          .update({ ...updates, updatedAt: new Date().toISOString() })
          .eq('id', structureId)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.warn('Failed to update fee structure:', error);
      }
    }

    return null;
  }

  async deleteFeeStructure(structureId: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error } = await supabase
          .from('fee_structures')
          .delete()
          .eq('id', structureId);
        
        if (error) throw error;
        return true;
      } catch (error) {
        console.warn('Failed to delete fee structure:', error);
      }
    }

    return false;
  }

  // Installment Plans Management
  async getInstallmentPlans(schoolId: string): Promise<InstallmentPlan[]> {
    const supabase = getSupabase();
    
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('installment_plans')
          .select('*')
          .eq('schoolId', schoolId)
          .order('numberOfInstallments');
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.warn('Failed to load installment plans:', error);
      }
    }

    return this.getMockInstallmentPlans();
  }

  async createInstallmentPlan(plan: Omit<InstallmentPlan, 'id'>): Promise<InstallmentPlan> {
    const newPlan: InstallmentPlan = {
      ...plan,
      id: Date.now().toString()
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('installment_plans')
          .insert([newPlan])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.warn('Failed to create installment plan:', error);
      }
    }

    return newPlan;
  }

  // Parent Fee Records Management
  async getParentFeeRecords(schoolId: string, studentId?: string): Promise<ParentFeeRecord[]> {
    const supabase = getSupabase();
    
    if (supabase) {
      try {
        let query = supabase
          .from('parent_fee_records')
          .select(`
            *,
            students (
              name,
              class,
              rollNumber
            ),
            fee_structures (
              categoryId,
              amount,
              dueDate
            )
          `)
          .eq('schoolId', schoolId);

        if (studentId) {
          query = query.eq('studentId', studentId);
        }

        const { data, error } = await query.order('nextDueDate');
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.warn('Failed to load parent fee records:', error);
      }
    }

    return this.getMockParentFeeRecords(schoolId);
  }

  async createParentFeeRecord(record: Omit<ParentFeeRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<ParentFeeRecord> {
    const newRecord: ParentFeeRecord = {
      ...record,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('parent_fee_records')
          .insert([newRecord])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.warn('Failed to create parent fee record:', error);
      }
    }

    return newRecord;
  }

  async updateParentFeeRecord(recordId: string, updates: Partial<ParentFeeRecord>): Promise<ParentFeeRecord | null> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('parent_fee_records')
          .update({ ...updates, updatedAt: new Date().toISOString() })
          .eq('id', recordId)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.warn('Failed to update parent fee record:', error);
      }
    }

    return null;
  }

  // Payment Processing
  async processPayment(
    feeRecordId: string, 
    amount: number, 
    paymentMethod: 'stripe' | 'paystack' | 'flutterwave' | 'bank_transfer' | 'cash',
    processedBy: string,
    notes?: string
  ): Promise<FeePaymentTransaction> {
    const transaction: FeePaymentTransaction = {
      id: Date.now().toString(),
      schoolId: '', // Will be filled from fee record
      feeRecordId,
      studentId: '', // Will be filled from fee record
      amount,
      paymentMethod,
      status: paymentMethod === 'cash' || paymentMethod === 'bank_transfer' ? 'completed' : 'pending',
      processedBy,
      notes,
      createdAt: new Date().toISOString()
    };

    if (paymentMethod === 'stripe') {
      try {
        const paymentIntent = await this.createStripePaymentIntent(amount, feeRecordId);
        transaction.stripePaymentIntentId = paymentIntent.clientSecret;
      } catch (error) {
        console.error('Failed to create Stripe payment intent:', error);
        throw error;
      }
    }

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('fee_payment_transactions')
          .insert([transaction])
          .select()
          .single();
        
        if (error) throw error;
        
        // Update fee record if payment is completed
        if (transaction.status === 'completed') {
          await this.updateFeeRecordAfterPayment(feeRecordId, amount);
        }
        
        return data;
      } catch (error) {
        console.warn('Failed to create payment transaction:', error);
      }
    }

    return transaction;
  }

  private async updateFeeRecordAfterPayment(feeRecordId: string, amount: number): Promise<void> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        // Get current fee record
        const { data: feeRecord, error: fetchError } = await supabase
          .from('parent_fee_records')
          .select('*')
          .eq('id', feeRecordId)
          .single();

        if (fetchError) throw fetchError;

        const newPaidAmount = feeRecord.paidAmount + amount;
        const newOutstandingAmount = feeRecord.totalAmount - newPaidAmount;
        const newStatus = newOutstandingAmount <= 0 ? 'paid' : 
                         newPaidAmount > 0 ? 'partial' : 'pending';

        // Update fee record
        const { error: updateError } = await supabase
          .from('parent_fee_records')
          .update({
            paidAmount: newPaidAmount,
            outstandingAmount: newOutstandingAmount,
            paymentStatus: newStatus,
            updatedAt: new Date().toISOString()
          })
          .eq('id', feeRecordId);

        if (updateError) throw updateError;
      } catch (error) {
        console.error('Failed to update fee record after payment:', error);
      }
    }
  }

  // Analytics and Metrics
  async getSchoolAdminFeeMetrics(schoolId: string): Promise<SchoolAdminFeeMetrics> {
    const supabase = getSupabase();
    
    if (supabase) {
      try {
        // This would typically involve complex queries to calculate metrics
        // For now, return mock data
        return this.getMockSchoolAdminMetrics();
      } catch (error) {
        console.warn('Failed to load fee metrics:', error);
      }
    }

    return this.getMockSchoolAdminMetrics();
  }

  // Stripe Integration (based on integration blueprint)
  private async createStripePaymentIntent(amount: number, feeRecordId: string): Promise<{ clientSecret: string }> {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          metadata: { feeRecordId, type: 'fee_payment' }
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

  // Mock Data Methods (for offline/demo mode)
  private getMockFeeCategories(schoolId: string): FeeCategory[] {
    return [
      {
        id: 'cat_1',
        schoolId,
        name: 'Tuition Fees',
        description: 'Academic tuition fees for all classes',
        isCompulsory: true,
        applicableClasses: ['Nursery', 'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6'],
        academicYear: '2023/2024',
        createdAt: '2023-09-01T00:00:00Z',
        updatedAt: '2023-09-01T00:00:00Z'
      },
      {
        id: 'cat_2',
        schoolId,
        name: 'Development Levy',
        description: 'School infrastructure development levy',
        isCompulsory: true,
        applicableClasses: ['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6'],
        academicYear: '2023/2024',
        createdAt: '2023-09-01T00:00:00Z',
        updatedAt: '2023-09-01T00:00:00Z'
      },
      {
        id: 'cat_3',
        schoolId,
        name: 'Sports & Extra-curricular',
        description: 'Sports activities and extra-curricular programs',
        isCompulsory: false,
        applicableClasses: ['Primary 3', 'Primary 4', 'Primary 5', 'Primary 6'],
        academicYear: '2023/2024',
        createdAt: '2023-09-01T00:00:00Z',
        updatedAt: '2023-09-01T00:00:00Z'
      }
    ];
  }

  private getMockFeeStructures(schoolId: string): FeeStructure[] {
    return [
      {
        id: 'fee_1',
        schoolId,
        categoryId: 'cat_1',
        className: 'Primary 1',
        amount: 150000,
        currency: 'NGN',
        dueDate: '2024-01-15T00:00:00Z',
        lateFeeAmount: 5000,
        lateFeeType: 'fixed',
        allowInstallments: true,
        isActive: true,
        createdAt: '2023-09-01T00:00:00Z',
        updatedAt: '2023-09-01T00:00:00Z'
      },
      {
        id: 'fee_2',
        schoolId,
        categoryId: 'cat_1',
        className: 'Primary 6',
        amount: 200000,
        currency: 'NGN',
        dueDate: '2024-01-15T00:00:00Z',
        lateFeeAmount: 10,
        lateFeeType: 'percentage',
        allowInstallments: true,
        isActive: true,
        createdAt: '2023-09-01T00:00:00Z',
        updatedAt: '2023-09-01T00:00:00Z'
      },
      {
        id: 'fee_3',
        schoolId,
        categoryId: 'cat_2',
        className: 'Primary 1',
        amount: 25000,
        currency: 'NGN',
        dueDate: '2024-02-01T00:00:00Z',
        lateFeeAmount: 2500,
        lateFeeType: 'fixed',
        allowInstallments: false,
        isActive: true,
        createdAt: '2023-09-01T00:00:00Z',
        updatedAt: '2023-09-01T00:00:00Z'
      }
    ];
  }

  private getMockInstallmentPlans(): InstallmentPlan[] {
    return [
      {
        id: 'inst_1',
        name: '3-Month Plan',
        numberOfInstallments: 3,
        installmentAmounts: [50000, 50000, 50000],
        dueDates: ['2024-01-15', '2024-02-15', '2024-03-15'],
        processingFee: 2500
      },
      {
        id: 'inst_2',
        name: '6-Month Plan',
        numberOfInstallments: 6,
        installmentAmounts: [25000, 25000, 25000, 25000, 25000, 25000],
        dueDates: ['2024-01-15', '2024-02-15', '2024-03-15', '2024-04-15', '2024-05-15', '2024-06-15'],
        processingFee: 5000
      }
    ];
  }

  private getMockParentFeeRecords(schoolId: string): ParentFeeRecord[] {
    return [
      {
        id: 'parent_fee_1',
        schoolId,
        studentId: 'student_1',
        feeStructureId: 'fee_1',
        academicYear: '2023/2024',
        totalAmount: 150000,
        paidAmount: 50000,
        outstandingAmount: 100000,
        lateFees: 0,
        discountApplied: 0,
        paymentStatus: 'partial',
        nextDueDate: '2024-02-15T00:00:00Z',
        createdAt: '2023-10-01T00:00:00Z',
        updatedAt: '2024-01-10T00:00:00Z'
      },
      {
        id: 'parent_fee_2',
        schoolId,
        studentId: 'student_2',
        feeStructureId: 'fee_2',
        academicYear: '2023/2024',
        totalAmount: 200000,
        paidAmount: 200000,
        outstandingAmount: 0,
        lateFees: 0,
        discountApplied: 10000,
        paymentStatus: 'paid',
        nextDueDate: '2024-01-15T00:00:00Z',
        createdAt: '2023-10-01T00:00:00Z',
        updatedAt: '2023-12-20T00:00:00Z'
      }
    ];
  }

  private getMockSchoolAdminMetrics(): SchoolAdminFeeMetrics {
    return {
      totalStudents: 1200,
      totalFeesCollected: 45000000,
      outstandingFees: 15000000,
      collectionRate: 75.0,
      averageFeePerStudent: 37500,
      latePayments: 180,
      thisMonthCollection: 8500000,
      activeInstallmentPlans: 320
    };
  }
}

export const feeManagementService = new FeeManagementService();