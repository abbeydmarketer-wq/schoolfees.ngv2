import React from 'react';

export interface PrintableDocumentProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  headerContent?: React.ReactNode;
  footerContent?: React.ReactNode;
}

const PrintableDocument: React.FC<PrintableDocumentProps> = ({ 
  title, 
  children, 
  className = '',
  headerContent,
  footerContent 
}) => {
  return (
    <div className={`printable-document ${className}`}>
      <style>{`
        @media print {
          .printable-document {
            width: 100%;
            margin: 0;
            padding: 20px;
            font-family: 'Arial', sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #000;
            background: white;
          }
          
          .print-header {
            border-bottom: 2px solid #000;
            margin-bottom: 20px;
            padding-bottom: 10px;
          }
          
          .print-title {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            margin: 10px 0;
          }
          
          .print-content {
            margin: 20px 0;
          }
          
          .print-footer {
            border-top: 1px solid #ccc;
            margin-top: 30px;
            padding-top: 10px;
            font-size: 10px;
            color: #666;
          }
          
          /* Hide non-printable elements */
          .no-print {
            display: none !important;
          }
        }
        
        @media screen {
          .printable-document {
            max-width: 8.5in;
            min-height: 11in;
            margin: 0 auto;
            padding: 1in;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            background: white;
          }
        }
      `}</style>
      
      {headerContent && (
        <div className="print-header">
          {headerContent}
        </div>
      )}
      
      <div className="print-title">
        {title}
      </div>
      
      <div className="print-content">
        {children}
      </div>
      
      {footerContent && (
        <div className="print-footer">
          {footerContent}
        </div>
      )}
    </div>
  );
};

export default PrintableDocument;