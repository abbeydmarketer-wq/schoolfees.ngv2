// Nigerian Payment Gateway Component - Unified Interface for Paystack, Flutterwave, and Manual Payments
import React, { useState } from 'react';
import { PaystackPayment } from './PaystackPayment';
import { FlutterwavePayment } from './FlutterwavePayment';

export type PaymentGateway = 'paystack' | 'flutterwave' | 'manual';

interface PaymentData {
  amount: number;
  email: string;
  phone: string;
  customerName: string;
  studentName: string;
  feeType: string;
}

interface NigerianPaymentGatewayProps {
  paymentData: PaymentData;
  onSuccess: (response: any) => void;
  onError: (error: any) => void;
  onClose: () => void;
  disabled?: boolean;
  preferredGateway?: PaymentGateway;
}

export const NigerianPaymentGateway: React.FC<NigerianPaymentGatewayProps> = ({
  paymentData,
  onSuccess,
  onError,
  onClose,
  disabled = false,
  preferredGateway = 'paystack'
}) => {
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>(preferredGateway);
  const [showManualPayment, setShowManualPayment] = useState(false);

  const handleManualPayment = () => {
    setShowManualPayment(true);
  };

  const handleBankTransferSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    // Simulate manual payment recording
    const manualPaymentResponse = {
      gateway: 'manual',
      reference: `SF_MANUAL_${Date.now()}`,
      amount: paymentData.amount,
      currency: 'NGN',
      status: 'pending_verification',
      student_name: paymentData.studentName,
      fee_type: paymentData.feeType,
      payment_method: 'bank_transfer'
    };
    
    onSuccess(manualPaymentResponse);
    setShowManualPayment(false);
  };

  return (
    <div className="nigerian-payment-gateway space-y-4">
      {/* Payment Method Selection */}
      <div className="payment-method-selection">
        <h3 className="text-lg font-semibold mb-3">Choose Payment Method</h3>
        
        <div className="tabs tabs-boxed mb-4">
          <button 
            className={`tab ${selectedGateway === 'paystack' ? 'tab-active' : ''}`}
            onClick={() => setSelectedGateway('paystack')}
          >
            Paystack
          </button>
          <button 
            className={`tab ${selectedGateway === 'flutterwave' ? 'tab-active' : ''}`}
            onClick={() => setSelectedGateway('flutterwave')}
          >
            Flutterwave
          </button>
          <button 
            className={`tab ${selectedGateway === 'manual' ? 'tab-active' : ''}`}
            onClick={() => setSelectedGateway('manual')}
          >
            Bank Transfer
          </button>
        </div>
      </div>

      {/* Payment Amount Display */}
      <div className="payment-summary bg-base-200 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">{paymentData.feeType}</p>
            <p className="text-sm text-gray-600">for {paymentData.studentName}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">₦{paymentData.amount.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Nigerian Naira</p>
          </div>
        </div>
      </div>

      {/* Payment Gateway Components */}
      <div className="payment-gateway-component">
        {selectedGateway === 'paystack' && (
          <PaystackPayment
            amount={paymentData.amount}
            email={paymentData.email}
            phone={paymentData.phone}
            studentName={paymentData.studentName}
            feeType={paymentData.feeType}
            onSuccess={onSuccess}
            onError={onError}
            onClose={onClose}
            disabled={disabled}
          />
        )}

        {selectedGateway === 'flutterwave' && (
          <FlutterwavePayment
            amount={paymentData.amount}
            email={paymentData.email}
            phone={paymentData.phone}
            customerName={paymentData.customerName}
            studentName={paymentData.studentName}
            feeType={paymentData.feeType}
            onSuccess={onSuccess}
            onError={onError}
            onClose={onClose}
            disabled={disabled}
          />
        )}

        {selectedGateway === 'manual' && !showManualPayment && (
          <div className="manual-payment-info">
            <div className="alert alert-info mb-4">
              <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <h3 className="font-bold">Bank Transfer Payment</h3>
                <div className="text-sm">
                  Transfer ₦{paymentData.amount.toLocaleString()} to our school account and upload proof of payment.
                </div>
              </div>
            </div>

            <div className="bank-details bg-base-200 p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-2">Bank Details</h4>
              <div className="space-y-1 text-sm">
                <div><span className="font-medium">Bank:</span> First Bank of Nigeria</div>
                <div><span className="font-medium">Account Name:</span> SchoolFees.NG Collection Account</div>
                <div><span className="font-medium">Account Number:</span> 2012345678</div>
                <div><span className="font-medium">Reference:</span> {paymentData.studentName}_FEE</div>
              </div>
            </div>

            <button
              onClick={handleManualPayment}
              className="btn btn-outline btn-primary w-full"
              disabled={disabled}
            >
              I have made the bank transfer
            </button>
          </div>
        )}

        {selectedGateway === 'manual' && showManualPayment && (
          <div className="manual-payment-form">
            <h4 className="font-semibold mb-3">Upload Payment Proof</h4>
            
            <form onSubmit={handleBankTransferSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Transaction Reference</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Enter bank transaction reference" 
                  className="input input-bordered" 
                  required 
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Upload Receipt/Proof</span>
                </label>
                <input 
                  type="file" 
                  accept="image/*,.pdf" 
                  className="file-input file-input-bordered w-full" 
                  required 
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Additional Notes</span>
                </label>
                <textarea 
                  className="textarea textarea-bordered" 
                  placeholder="Any additional information..."
                ></textarea>
              </div>

              <div className="flex gap-2">
                <button 
                  type="submit" 
                  className="btn btn-primary flex-1"
                  disabled={disabled}
                >
                  Submit Payment Proof
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={() => setShowManualPayment(false)}
                >
                  Back
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Payment Security Info */}
      <div className="payment-security-info text-xs text-gray-500 mt-4">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span>Your payment is secured with 256-bit SSL encryption</span>
        </div>
      </div>
    </div>
  );
};