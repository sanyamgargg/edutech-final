import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-300 border-t-white`}></div>
      {text && <p className="text-gray-400 text-sm">{text}</p>}
    </div>
  );
};

export default LoadingSpinner; 