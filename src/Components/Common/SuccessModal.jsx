import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

const SuccessModal = ({ isOpen, onClose, success, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md z-50 relative"
        >
          <div className="flex flex-col items-center">
            {success ? (
              <FiCheckCircle className="w-12 h-12 text-green-500 mb-4" />
            ) : (
              <FiXCircle className="w-12 h-12 text-red-500 mb-4" />
            )}

            <h2 className="text-lg font-medium text-gray-900 mb-2">
              {success ? 'Success' : 'Error'}
            </h2>

            <p className="text-sm text-gray-500 mb-6 text-center">{message}</p>

            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SuccessModal;
