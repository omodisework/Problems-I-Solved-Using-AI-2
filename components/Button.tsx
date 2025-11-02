import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, loading, className, ...props }) => {
  return (
    <button
      className={`
        bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg
        transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75
        ${loading ? 'opacity-75 cursor-not-allowed' : ''}
        ${className || ''}
      `}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
