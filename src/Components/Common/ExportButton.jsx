import React from 'react';
import { motion } from 'framer-motion';
import { PiFilePdfDuotone } from 'react-icons/pi';
import { useUnauthorizedRedirect } from '../../Hooks/useUnauthorizedRedirect';

const ExportButton = ({
  exportPermission,
  onExport,
  isLoading,
  className = '',
}) => {
  const { checkPermissionAndExecute } = useUnauthorizedRedirect();

  const handleExport = () => {
    checkPermissionAndExecute(exportPermission, onExport);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleExport}
      disabled={isLoading}
      className={`p-2 rounded-lg transition-colors duration-300 ${
        isLoading
          ? 'bg-gray-100 cursor-not-allowed'
          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
      } ${className}`}
    >
      {isLoading ? (
        <div className="animate-spin">
          <svg
            className="w-[18px] h-[18px] text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      ) : (
        <PiFilePdfDuotone size={18} />
      )}
    </motion.button>
  );
};

export default ExportButton;
