import React from 'react';
import { Payslip, TeamMember, School } from '../../types';

export interface PayslipTemplateProps {
  payslip: Payslip;
  teamMember: TeamMember;
  school: School;
}

const PayslipTemplate: React.FC<PayslipTemplateProps> = ({ payslip, teamMember, school }) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-NG');
  };

  const getPeriodDisplay = (): string => {
    if (payslip.year && payslip.month) {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return `${monthNames[payslip.month - 1]} ${payslip.year}`;
    }
    return payslip.period;
  };

  return (
    <div className="payslip-template p-6 bg-white">
      <style>{`
        @media print {
          .payslip-template {
            width: 100%;
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
          }
        }
        
        .payslip-header {
          text-align: center;
          border-bottom: 2px solid #000;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        
        .payslip-title {
          font-size: 18px;
          font-weight: bold;
          margin: 10px 0;
        }
        
        .employee-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        
        .info-section {
          flex: 1;
        }
        
        .info-label {
          font-weight: bold;
          margin-right: 10px;
        }
        
        .earnings-deductions {
          display: flex;
          justify-content: space-between;
          margin: 20px 0;
        }
        
        .earnings, .deductions {
          flex: 1;
          margin: 0 10px;
        }
        
        .section-title {
          font-weight: bold;
          border-bottom: 1px solid #ccc;
          padding-bottom: 5px;
          margin-bottom: 10px;
        }
        
        .line-item {
          display: flex;
          justify-content: space-between;
          padding: 3px 0;
          border-bottom: 1px dotted #ccc;
        }
        
        .summary {
          border: 2px solid #000;
          padding: 15px;
          margin-top: 20px;
          background-color: #f9f9f9;
        }
        
        .summary-item {
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
          font-weight: bold;
        }
        
        .net-pay {
          font-size: 16px;
          border-top: 2px solid #000;
          padding-top: 10px;
          margin-top: 10px;
        }
      `}</style>

      {/* Header */}
      <div className="payslip-header">
        <div className="school-name text-lg font-bold">{school.name}</div>
        <div className="school-address text-sm">{school.address}</div>
        <div className="payslip-title">PAYSLIP</div>
        <div className="pay-period">Pay Period: {getPeriodDisplay()}</div>
      </div>

      {/* Employee Information */}
      <div className="employee-info">
        <div className="info-section">
          <div><span className="info-label">Employee ID:</span>{teamMember.id}</div>
          <div><span className="info-label">Employee Name:</span>{teamMember.name}</div>
          <div><span className="info-label">Email:</span>{teamMember.email}</div>
        </div>
        <div className="info-section">
          <div><span className="info-label">Position:</span>{teamMember.role}</div>
          <div><span className="info-label">Department:</span>{teamMember.department || 'General'}</div>
          <div><span className="info-label">Date Generated:</span>{formatDate(payslip.generatedAt)}</div>
        </div>
      </div>

      {/* Earnings and Deductions */}
      <div className="earnings-deductions">
        <div className="earnings">
          <div className="section-title">EARNINGS</div>
          <div className="line-item">
            <span>Basic Salary</span>
            <span>{formatCurrency(payslip.basicSalary)}</span>
          </div>
          {payslip.allowances.map((allowance) => (
            <div key={allowance.id} className="line-item">
              <span>{allowance.name}</span>
              <span>{formatCurrency(allowance.amount)}</span>
            </div>
          ))}
          <div className="line-item font-bold border-t-2 border-black mt-2 pt-2">
            <span>Gross Pay</span>
            <span>{formatCurrency(payslip.grossPay)}</span>
          </div>
        </div>

        <div className="deductions">
          <div className="section-title">DEDUCTIONS</div>
          {payslip.deductions.map((deduction) => (
            <div key={deduction.id} className="line-item">
              <span>{deduction.name}</span>
              <span>{formatCurrency(deduction.amount)}</span>
            </div>
          ))}
          <div className="line-item font-bold border-t-2 border-black mt-2 pt-2">
            <span>Total Deductions</span>
            <span>{formatCurrency(payslip.deductions.reduce((sum, d) => sum + d.amount, 0))}</span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="summary">
        <div className="summary-item">
          <span>Gross Pay:</span>
          <span>{formatCurrency(payslip.grossPay)}</span>
        </div>
        <div className="summary-item">
          <span>Total Deductions:</span>
          <span>{formatCurrency(payslip.deductions.reduce((sum, d) => sum + d.amount, 0))}</span>
        </div>
        <div className="summary-item net-pay">
          <span>NET PAY:</span>
          <span>{formatCurrency(payslip.netPay)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-xs text-gray-600">
        <p>This is a computer-generated payslip. No signature is required.</p>
        <p>Generated on: {formatDate(payslip.generatedAt)}</p>
      </div>
    </div>
  );
};

export default PayslipTemplate;