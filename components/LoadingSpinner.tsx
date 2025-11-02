import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
      <p className="ml-3 text-lg text-gray-400">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
