import React from 'react';

interface UpgradeModalProps {
    onClose: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ onClose }) => {
    return (
        <div className="modal modal-open" role="dialog">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Upgrade Your Plan</h3>
                <p className="py-4">
                    This feature is part of our premium plan. Please upgrade to access it.
                </p>
                <div className="modal-action">
                    <button className="btn" onClick={onClose}>
                        Close
                    </button>
                    <button className="btn btn-primary">Upgrade Now</button>
                </div>
            </div>
        </div>
    );
};

export default UpgradeModal;