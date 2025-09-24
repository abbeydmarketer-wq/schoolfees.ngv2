// Paystack Payment Component for Parent Fee Payments
import React, { useState } from 'react';
import { usePaystackPayment } from 'react-paystack';

interface PaystackPaymentProps {
  amount: number; // Amount in Naira (will be converted to kobo)
  email: string;
  phone: string;
  studentName: string;
  feeType: string;
  onSuccess: (reference: any) => void;
  onError: (error: any) => void;
  onClose: () => void;
  disabled?: boolean;
}

export const PaystackPayment: React.FC<PaystackPaymentProps> = ({
  amount,
  email,
  phone,
  studentName,
  feeType,
  onSuccess,
  onError,
  onClose,
  disabled = false
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Paystack configuration
  const config = {
    reference: `SF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    email,
    amount: Math.round(amount * 100), // Convert Naira to kobo
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_temp_key',
    currency: 'NGN',
    channels: ['card', 'bank', 'ussd', 'mobile_money'],
    metadata: {
      custom_fields: [
        {
          display_name: "Student Name",
          variable_name: "student_name",
          value: studentName
        },
        {
          display_name: "Fee Type",
          variable_name: "fee_type", 
          value: feeType
        },
        {
          display_name: "Phone Number",
          variable_name: "phone_number",
          value: phone
        }
      ]
    }
  };

  const initializePayment = usePaystackPayment(config);

  const handlePayment = () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    initializePayment(
      (reference) => {
        setIsProcessing(false);
        console.log('Paystack payment successful:', reference);
        onSuccess({
          ...reference,
          gateway: 'paystack',
          amount: amount,
          currency: 'NGN'
        });
      },
      () => {
        setIsProcessing(false);
        console.log('Paystack payment closed');
        onClose();
      }
    );
  };

  // Check if Paystack public key is configured
  const isConfigured = config.publicKey && config.publicKey !== 'pk_test_temp_key';

  return (
    <div className="paystack-payment">
      <button
        onClick={handlePayment}
        disabled={disabled || isProcessing || !isConfigured}
        className={`
          btn w-full mb-2 flex items-center justify-center gap-2
          ${!isConfigured ? 'btn-disabled' : 'btn-success hover:btn-success'}
          ${isProcessing ? 'loading' : ''}
        `}
      >
        {isProcessing && <span className="loading loading-spinner loading-sm"></span>}
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="currentColor"
          className="flex-shrink-0"
        >
          <path d="M8.17 12.17c.39.39 1.02.39 1.41 0L12 9.83l2.42 2.34c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-3.13-3.04c-.39-.39-1.02-.39-1.41 0L8.17 10.76c-.39.39-.39 1.02 0 1.41z"/>
        </svg>
        {isProcessing ? 'Processing...' : `Pay ₦${amount.toLocaleString()} with Paystack`}
      </button>
      
      {!isConfigured && (
        <div className="alert alert-warning text-sm">
          <svg className="stroke-current shrink-0 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span>Paystack not configured. Please add VITE_PAYSTACK_PUBLIC_KEY.</span>
        </div>
      )}
      
      <div className="text-xs text-gray-500 mt-1">
        • Secure payment with Paystack
        • Supports cards, bank transfer, USSD
        • Transaction fee: 1.5% + ₦100
      </div>
    </div>
  );
};