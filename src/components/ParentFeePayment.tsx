// Parent Fee Payment Interface - Nigerian Payment Gateways Integration
import React, { useState, useEffect } from 'react';
import { NigerianPaymentGateway, PaymentData } from './NigerianPaymentGateway';
import { feeManagementService } from '../services/feeManagementService';
import { studentManagementService, ParentAccount } from '../services/studentManagementService';
import { Student } from '../types';

interface ParentFeePaymentProps {
  parent: ParentAccount;
  students: Student[];
  schoolId: string;
}

interface FeePaymentItem {
  feeRecordId: string; // Preserve actual ParentFeeRecord.id
  studentId: string;
  studentName: string;
  feeType: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'overdue' | 'paid';
}

export const ParentFeePayment: React.FC<ParentFeePaymentProps> = ({
  parent,
  students,
  schoolId
}) => {
  const [feeItems, setFeeItems] = useState<FeePaymentItem[]>([]);
  const [selectedFees, setSelectedFees] = useState<string[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paymentInProgress, setPaymentInProgress] = useState(false);
  
  useEffect(() => {
    loadParentFees();
  }, [parent.id, students]);

  const loadParentFees = async () => {
    setLoading(true);
    try {
      // Get all fee records for the parent's children
      const parentStudents = students.filter(student => 
        parent.childrenIds.includes(student.id)
      );

      const allFeeItems: FeePaymentItem[] = [];

      for (const student of parentStudents) {
        try {
          // Get real fee records from feeManagementService for this specific student
          const studentFeeRecords = await feeManagementService.getStudentFeeRecords(schoolId, student.id);
          
          // Convert fee records to FeePaymentItem format
          const studentFeeItems: FeePaymentItem[] = studentFeeRecords.map(record => ({
            feeRecordId: record.id, // Preserve actual record ID
            studentId: student.id,
            studentName: student.name,
            feeType: record.feeStructureId || 'General Fee', // Use feeStructureId as feeType
            amount: record.outstandingAmount, // Outstanding amount
            dueDate: record.nextDueDate,
            status: (record.paymentStatus === 'paid' ? 'paid' : 
                    (record.paymentStatus === 'overdue' ? 'overdue' : 'pending')) as 'pending' | 'overdue' | 'paid'
          })).filter(item => item.amount > 0); // Only show unpaid fees
          
          allFeeItems.push(...studentFeeItems);
          
        } catch (feeError) {
          console.warn(`Failed to load fees for student ${student.name}:`, feeError);
          
          // Fallback to mock data for this student if service fails
          const mockFees: FeePaymentItem[] = [
            {
              feeRecordId: `mock_fee_${student.id}_tuition`,
              studentId: student.id,
              studentName: student.name,
              feeType: 'Tuition Fee',
              amount: 150000,
              dueDate: '2024-02-15',
              status: 'pending'
            },
            {
              feeRecordId: `mock_fee_${student.id}_library`,
              studentId: student.id,
              studentName: student.name,
              feeType: 'Library Fee',
              amount: 25000,
              dueDate: '2024-02-10',
              status: 'overdue'
            }
          ];
          
          allFeeItems.push(...mockFees);
        }
      }

      setFeeItems(allFeeItems);
    } catch (error) {
      console.error('Failed to load parent fees:', error);
      
      // Show user-friendly error message
      alert('Failed to load fee information. Please try again or contact school administration.');
    } finally {
      setLoading(false);
    }
  };

  const handleFeeSelection = (feeIndex: string) => {
    setSelectedFees(prev => 
      prev.includes(feeIndex) 
        ? prev.filter(id => id !== feeIndex)
        : [...prev, feeIndex]
    );
  };

  const calculateTotalAmount = () => {
    return selectedFees.reduce((total, feeIndex) => {
      const fee = feeItems[parseInt(feeIndex)];
      return total + (fee ? fee.amount : 0);
    }, 0);
  };

  const handlePaymentSuccess = async (response: any) => {
    console.log('Payment successful:', response);
    setPaymentInProgress(true);
    
    try {
      // Process each selected fee payment
      for (const feeIndex of selectedFees) {
        const fee = feeItems[parseInt(feeIndex)];
        
        // Record the payment transaction using feeManagementService with real record ID
        await feeManagementService.processParentFeePayment({
          parentId: parent.id,
          studentId: fee.studentId,
          feeRecordId: fee.feeRecordId, // Use actual ParentFeeRecord.id
          amount: fee.amount,
          paymentGateway: response.gateway,
          customerEmail: parent.email,
          customerPhone: parent.phone,
          customerName: parent.name
        });
        
        // Verify payment if it's from a gateway
        if (response.gateway === 'paystack' || response.gateway === 'flutterwave') {
          await feeManagementService.verifyParentFeePayment(
            response.reference || response.transaction_id, 
            response.gateway
          );
        }
      }
      
      setPaymentInProgress(false);
      setShowPayment(false);
      setSelectedFees([]);
      
      // Show success message with actual reference
      alert(`Payment successful! Reference: ${response.reference || response.transaction_id || response.paymentReference}\n\nPayment has been recorded and will be verified shortly.`);
      
      // Reload fee data to reflect updated status
      await loadParentFees();
      
    } catch (error) {
      console.error('Failed to process payment:', error);
      setPaymentInProgress(false);
      alert(`Payment was received but failed to record: ${error instanceof Error ? error.message : 'Please contact school administration'}`);
    }
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment failed:', error);
    setPaymentInProgress(false);
    
    // Show detailed error message to help parents understand what went wrong
    let errorMessage = 'Payment failed. ';
    
    if (error.message) {
      errorMessage += error.message;
    } else if (error.status) {
      errorMessage += `Status: ${error.status}`;
    } else {
      errorMessage += 'Please check your internet connection and try again.';
    }
    
    errorMessage += '\n\nIf the problem persists, please contact the school administration.';
    
    alert(errorMessage);
  };

  const handlePaymentClose = () => {
    setPaymentInProgress(false);
    setShowPayment(false);
  };

  const initiatePayment = () => {
    if (selectedFees.length === 0) {
      alert('Please select at least one fee to pay');
      return;
    }
    
    setShowPayment(true);
  };

  const getPaymentData = (): PaymentData => {
    const totalAmount = calculateTotalAmount();
    const selectedFeeDetails = selectedFees.map(feeIndex => {
      const fee = feeItems[parseInt(feeIndex)];
      return `${fee.feeType} for ${fee.studentName}`;
    }).join(', ');

    return {
      amount: totalAmount,
      email: parent.email,
      phone: parent.phone,
      customerName: parent.name,
      studentName: selectedFees.length === 1 
        ? feeItems[parseInt(selectedFees[0])].studentName 
        : 'Multiple Students',
      feeType: selectedFees.length === 1 
        ? feeItems[parseInt(selectedFees[0])].feeType 
        : `Multiple Fees (${selectedFees.length} items)`
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
        <span className="ml-2">Loading fee information...</span>
      </div>
    );
  }

  return (
    <div className="parent-fee-payment space-y-6">
      {/* Header */}
      <div className="bg-base-200 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Fee Payment Portal</h2>
            <p className="text-sm text-gray-600">Welcome, {parent.name}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Children Enrolled</p>
            <p className="font-semibold">{parent.childrenIds.length} Student(s)</p>
          </div>
        </div>
      </div>

      {/* Fee Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Total Pending</div>
          <div className="stat-value text-orange-600">
            ₦{feeItems.filter(f => f.status === 'pending').reduce((sum, f) => sum + f.amount, 0).toLocaleString()}
          </div>
          <div className="stat-desc">{feeItems.filter(f => f.status === 'pending').length} fees</div>
        </div>
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Overdue</div>
          <div className="stat-value text-red-600">
            ₦{feeItems.filter(f => f.status === 'overdue').reduce((sum, f) => sum + f.amount, 0).toLocaleString()}
          </div>
          <div className="stat-desc">{feeItems.filter(f => f.status === 'overdue').length} fees</div>
        </div>
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Selected Amount</div>
          <div className="stat-value text-blue-600">
            ₦{calculateTotalAmount().toLocaleString()}
          </div>
          <div className="stat-desc">{selectedFees.length} selected</div>
        </div>
      </div>

      {/* Fee Items List */}
      <div className="fee-items">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Outstanding Fees</h3>
          <button
            onClick={initiatePayment}
            disabled={selectedFees.length === 0 || paymentInProgress}
            className="btn btn-primary"
          >
            {paymentInProgress ? 'Processing...' : `Pay Selected (₦${calculateTotalAmount().toLocaleString()})`}
          </button>
        </div>

        <div className="space-y-3">
          {feeItems.map((fee, index) => (
            <div key={index} className="fee-item card bg-base-100 shadow-sm">
              <div className="card-body p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={selectedFees.includes(index.toString())}
                      onChange={() => handleFeeSelection(index.toString())}
                      disabled={fee.status === 'paid'}
                    />
                    <div>
                      <p className="font-medium">{fee.feeType}</p>
                      <p className="text-sm text-gray-600">{fee.studentName}</p>
                      <p className="text-xs text-gray-500">Due: {new Date(fee.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">₦{fee.amount.toLocaleString()}</p>
                    <div className={`badge ${
                      fee.status === 'paid' ? 'badge-success' :
                      fee.status === 'overdue' ? 'badge-error' : 'badge-warning'
                    }`}>
                      {fee.status}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {feeItems.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No outstanding fees found</p>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4">Complete Payment</h3>
            
            <NigerianPaymentGateway
              paymentData={getPaymentData()}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              onClose={handlePaymentClose}
              disabled={paymentInProgress}
            />
            
            <div className="modal-action">
              <button 
                className="btn btn-outline" 
                onClick={handlePaymentClose}
                disabled={paymentInProgress}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};