import React from 'react';

interface ModalHeaderProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ title, subtitle, onClose }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <h3 className="font-bold text-lg">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      </div>
      <button
        className="btn btn-sm btn-circle btn-ghost"
        onClick={onClose}
      >
        ✕
      </button>
    </div>
  );
};

export default ModalHeader;