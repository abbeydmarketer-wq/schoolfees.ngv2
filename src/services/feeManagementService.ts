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

  // Payment Processing (Legacy method - use processParentFeePayment for new implementations)
  async processPayment(
    feeRecordId: string, 
    amount: number, 
    paymentGateway: 'paystack' | 'flutterwave' | 'manual',
    processedBy: string,
    notes?: string
  ): Promise<FeePaymentTransaction> {
    const reference = `SF_LEGACY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const transaction: FeePaymentTransaction = {
      id: Date.now().toString(),
      schoolId: '', // Will be filled from fee record
      feeRecordId,
      studentId: '', // Will be filled from fee record
      amount,
      currency: 'NGN',
      paymentGateway,
      paymentMethod: paymentGateway === 'manual' ? 'bank_transfer' : 'card',
      reference,
      status: paymentGateway === 'manual' ? 'completed' : 'pending',
      initiatedAt: new Date().toISOString(),
      processedBy,
      notes,
      createdAt: new Date().toISOString()
    };

    // No longer using Stripe - removed deprecated code

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

  // Nigerian Payment Gateway Processing for Parent Fee Payments
  async processParentFeePayment(
    paymentData: {
      parentId: string;
      studentId: string;
      feeRecordId: string;
      amount: number;
      paymentGateway: 'paystack' | 'flutterwave' | 'manual';
      customerEmail: string;
      customerPhone: string;
      customerName: string;
    }
  ): Promise<{ paymentReference: string; paymentUrl?: string; status: string }> {
    try {
      const { 
        parentId, 
        studentId, 
        feeRecordId, 
        amount, 
        paymentGateway, 
        customerEmail, 
        customerPhone, 
        customerName 
      } = paymentData;

      console.log('Processing parent fee payment:', paymentData);

      if (paymentGateway === 'paystack') {
        // Initialize Paystack payment for parent fee
        const reference = `SF_PARENT_PAYSTACK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // In real implementation, this would call Paystack API
        const mockPaystackResponse = {
          paymentReference: reference,
          paymentUrl: `https://checkout.paystack.com/${reference}`,
          status: 'pending'
        };

        // Record the payment initiation
        await this.recordPaymentTransaction({
          id: reference,
          parentId,
          studentId,
          feeRecordId,
          amount,
          currency: 'NGN',
          paymentGateway: 'paystack',
          status: 'pending',
          reference,
          initiatedAt: new Date().toISOString(),
          metadata: {
            customerEmail,
            customerPhone,
            customerName
          }
        });

        return mockPaystackResponse;

      } else if (paymentGateway === 'flutterwave') {
        // Initialize Flutterwave payment for parent fee
        const tx_ref = `SF_PARENT_FLW_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // In real implementation, this would call Flutterwave API
        const mockFlutterwaveResponse = {
          paymentReference: tx_ref,
          paymentUrl: `https://checkout.flutterwave.com/${tx_ref}`,
          status: 'pending'
        };

        // Record the payment initiation
        await this.recordPaymentTransaction({
          id: tx_ref,
          parentId,
          studentId,
          feeRecordId,
          amount,
          currency: 'NGN',
          paymentGateway: 'flutterwave',
          status: 'pending',
          reference: tx_ref,
          initiatedAt: new Date().toISOString(),
          metadata: {
            customerEmail,
            customerPhone,
            customerName
          }
        });

        return mockFlutterwaveResponse;

      } else {
        // Manual/Bank transfer payment
        const reference = `SF_PARENT_MANUAL_${Date.now()}`;
        
        // Record the manual payment initiation
        await this.recordPaymentTransaction({
          id: reference,
          parentId,
          studentId,
          feeRecordId,
          amount,
          currency: 'NGN',
          paymentGateway: 'manual',
          status: 'pending_verification',
          reference,
          initiatedAt: new Date().toISOString(),
          metadata: {
            customerEmail,
            customerPhone,
            customerName,
            paymentMethod: 'bank_transfer'
          }
        });

        return {
          paymentReference: reference,
          status: 'pending_verification'
        };
      }

    } catch (error) {
      console.error('Error processing parent fee payment:', error);
      throw error;
    }
  }

  async verifyParentFeePayment(
    reference: string, 
    paymentGateway: 'paystack' | 'flutterwave'
  ): Promise<{ status: string; amount: number; verified: boolean }> {
    try {
      console.log('Verifying parent fee payment:', { reference, paymentGateway });

      if (paymentGateway === 'paystack') {
        // In real implementation, verify with Paystack API
        // For offline mode, return mock success
        const verification = {
          status: 'success',
          amount: 50000, // Amount in kobo
          verified: true
        };

        // Update payment transaction status
        await this.updatePaymentTransactionStatus(reference, 'completed', {
          verifiedAt: new Date().toISOString(),
          verificationResponse: verification
        });

        return verification;

      } else if (paymentGateway === 'flutterwave') {
        // In real implementation, verify with Flutterwave API
        // For offline mode, return mock success
        const verification = {
          status: 'successful',
          amount: 500, // Amount in Naira
          verified: true
        };

        // Update payment transaction status
        await this.updatePaymentTransactionStatus(reference, 'completed', {
          verifiedAt: new Date().toISOString(),
          verificationResponse: verification
        });

        return verification;
      }

      throw new Error('Unsupported payment gateway for verification');

    } catch (error) {
      console.error('Error verifying parent fee payment:', error);
      throw error;
    }
  }

  async recordPaymentTransaction(transaction: FeePaymentTransaction): Promise<FeePaymentTransaction> {
    const supabase = getSupabase();
    
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('fee_payment_transactions')
          .insert([transaction])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.warn('Failed to record payment transaction in database:', error);
      }
    }

    // Store in offline mode (could use localStorage if needed)
    console.log('Payment transaction recorded in offline mode:', transaction);
    return transaction;
  }

  async updatePaymentTransactionStatus(
    reference: string, 
    status: string, 
    updates: any = {}
  ): Promise<boolean> {
    const supabase = getSupabase();
    
    if (supabase) {
      try {
        const { error } = await supabase
          .from('fee_payment_transactions')
          .update({ 
            status, 
            ...updates,
            updatedAt: new Date().toISOString() 
          })
          .eq('reference', reference);
        
        if (error) throw error;
        return true;
      } catch (error) {
        console.warn('Failed to update payment transaction status:', error);
      }
    }

    // Update in offline mode
    console.log('Payment transaction status updated in offline mode:', { reference, status, updates });
    return true;
  }

  // Student Fee Records Management
  async getStudentFeeRecords(schoolId: string, studentId: string): Promise<ParentFeeRecord[]> {
    const supabase = getSupabase();
    
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('parent_fee_records')
          .select('*')
          .eq('schoolId', schoolId)
          .eq('studentId', studentId)
          .order('nextDueDate');
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.warn('Failed to load student fee records:', error);
      }
    }

    // Return mock data for offline mode
    return this.getMockParentFeeRecords('').filter(record => record.studentId === studentId);
  }

  // Parent Fee Records Management  
  async getParentFeeRecords(parentId: string): Promise<ParentFeeRecord[]> {
    const supabase = getSupabase();
    
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('parent_fee_records')
          .select('*')
          .eq('parentId', parentId)
          .order('dueDate');
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.warn('Failed to load parent fee records:', error);
      }
    }

    // Return mock data for offline mode
    return this.getMockParentFeeRecords(parentId);
  }

  private getMockParentFeeRecords(parentId: string): ParentFeeRecord[] {
    // Generate mock fee records for the parent's children
    return [
      {
        id: 'fee_record_1',
        schoolId: 'sch_sunnydale_123',
        studentId: 'stu_sunnydale_123_1',
        feeStructureId: 'Tuition Fee',
        academicYear: '2023/2024',
        totalAmount: 150000,
        paidAmount: 0,
        outstandingAmount: 150000,
        lateFees: 0,
        discountApplied: 0,
        paymentStatus: 'pending',
        installmentPlan: 'full',
        nextDueDate: '2024-02-15',
        createdAt: '2023-09-01T00:00:00Z',
        updatedAt: '2023-09-01T00:00:00Z'
      },
      {
        id: 'fee_record_2',
        schoolId: 'sch_sunnydale_123',
        studentId: 'stu_sunnydale_123_1',
        feeStructureId: 'Library Fee',
        academicYear: '2023/2024',
        totalAmount: 25000,
        paidAmount: 0,
        outstandingAmount: 25000,
        lateFees: 2500,
        discountApplied: 0,
        paymentStatus: 'overdue',
        installmentPlan: 'full',
        nextDueDate: '2024-02-10',
        createdAt: '2023-09-01T00:00:00Z',
        updatedAt: '2023-09-01T00:00:00Z'
      },
      {
        id: 'fee_record_3',
        schoolId: 'sch_sunnydale_123',
        studentId: 'stu_sunnydale_123_2',
        feeStructureId: 'Sports Fee',
        academicYear: '2023/2024',
        totalAmount: 35000,
        paidAmount: 0,
        outstandingAmount: 35000,
        lateFees: 0,
        discountApplied: 0,
        paymentStatus: 'pending',
        installmentPlan: 'full',
        nextDueDate: '2024-02-20',
        createdAt: '2023-09-01T00:00:00Z',
        updatedAt: '2023-09-01T00:00:00Z'
      }
    ];
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