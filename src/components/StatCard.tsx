import React from 'react';

interface StatCardProps {
  icon: 'revenue' | 'students' | 'outstanding' | string;
  title: string;
  value: string;
  change: string;
  color?: 'orange' | 'green' | 'blue' | 'red' | string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, change, color = 'blue' }) => {
  const getIconSvg = (iconType: string) => {
    switch (iconType) {
      case 'revenue':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7v10c0 5.55 3.84 10 9 9s9-4.03 9-9V7z"/>
            <path d="M12 8v8"/>
            <path d="M8 12h8"/>
          </svg>
        );
      case 'students':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        );
      case 'outstanding':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        );
    }
  };

  const getColorClasses = (colorType: string) => {
    switch (colorType) {
      case 'orange':
        return {
          bg: 'bg-orange-100',
          text: 'text-orange-600',
          accent: 'text-orange-500'
        };
      case 'green':
        return {
          bg: 'bg-green-100',
          text: 'text-green-600',
          accent: 'text-green-500'
        };
      case 'red':
        return {
          bg: 'bg-red-100',
          text: 'text-red-600',
          accent: 'text-red-500'
        };
      case 'blue':
      default:
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-600',
          accent: 'text-blue-500'
        };
    }
  };

  const colorClasses = getColorClasses(color);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`${colorClasses.bg} ${colorClasses.text} p-3 rounded-full`}>
            {getIconSvg(icon)}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <p className={`text-sm ${colorClasses.accent}`}>{change}</p>
      </div>
    </div>
  );
};

export default StatCard;