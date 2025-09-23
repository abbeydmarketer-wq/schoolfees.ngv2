import React from 'react';

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ title, onClose }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-bold text-lg">{title}</h3>
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