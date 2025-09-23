import React from 'react';

interface UpgradePromptProps {
  currentPlanName?: string;
  onUpgrade: () => void;
}

const UpgradePrompt: React.FC<UpgradePromptProps> = ({ currentPlanName, onUpgrade }) => {
  return (
    <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content">
      <div className="card-body">
        <h2 className="card-title">Upgrade Required</h2>
        <p>This feature requires a premium plan to continue. {currentPlanName && `You are currently on the ${currentPlanName} plan.`}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-accent" onClick={onUpgrade}>
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradePrompt;