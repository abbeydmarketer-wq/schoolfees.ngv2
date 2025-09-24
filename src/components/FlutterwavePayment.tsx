// Flutterwave Payment Component for Parent Fee Payments
import React, { useState } from 'react';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';

interface FlutterwavePaymentProps {
  amount: number; // Amount in Naira
  email: string;
  phone: string;
  customerName: string;
  studentName: string;
  feeType: string;
  onSuccess: (response: any) => void;
  onError: (error: any) => void;
  onClose: () => void;
  disabled?: boolean;
}

export const FlutterwavePayment: React.FC<FlutterwavePaymentProps> = ({
  amount,
  email,
  phone,
  customerName,
  studentName,
  feeType,
  onSuccess,
  onError,
  onClose,
  disabled = false
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Flutterwave configuration
  const config = {
    public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || 'FLWPUBK-test-temp-key',
    tx_ref: `SF_FLW_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    amount,
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd,banktransfer',
    customer: {
      email,
      phone_number: phone,
      name: customerName,
    },
    customizations: {
      title: 'SchoolFees.NG',
      description: `${feeType} payment for ${studentName}`,
      logo: '/logo.png',
    },
    meta: {
      student_name: studentName,
      fee_type: feeType,
      payment_for: 'school_fees'
    }
  };

  const handleFlutterPayment = useFlutterwave(config);

  const handlePayment = () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    handleFlutterPayment({
      callback: (response) => {
        setIsProcessing(false);
        console.log('Flutterwave payment response:', response);
        
        if (response.status === 'successful') {
          onSuccess({
            ...response,
            gateway: 'flutterwave',
            amount,
            currency: 'NGN'
          });
        } else {
          onError({
            message: 'Payment was not successful',
            status: response.status,
            response
          });
        }
        
        closePaymentModal();
      },
      onClose: () => {
        setIsProcessing(false);
        console.log('Flutterwave payment closed');
        onClose();
      },
    });
  };

  // Check if Flutterwave public key is configured
  const isConfigured = config.public_key && config.public_key !== 'FLWPUBK-test-temp-key';

  return (
    <div className="flutterwave-payment">
      <button
        onClick={handlePayment}
        disabled={disabled || isProcessing || !isConfigured}
        className={`
          btn w-full mb-2 flex items-center justify-center gap-2
          ${!isConfigured ? 'btn-disabled' : 'btn-primary hover:btn-primary'}
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
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-5h2v2h-2zm0-8h2v6h-2z"/>
        </svg>
        {isProcessing ? 'Processing...' : `Pay ₦${amount.toLocaleString()} with Flutterwave`}
      </button>
      
      {!isConfigured && (
        <div className="alert alert-warning text-sm">
          <svg className="stroke-current shrink-0 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span>Flutterwave not configured. Please add VITE_FLUTTERWAVE_PUBLIC_KEY.</span>
        </div>
      )}
      
      <div className="text-xs text-gray-500 mt-1">
        • Secure payment with Flutterwave
        • Supports 30+ currencies worldwide
        • Transaction fee: 3.8% for local cards
      </div>
    </div>
  );
};