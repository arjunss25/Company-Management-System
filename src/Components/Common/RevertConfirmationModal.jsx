import React from 'react';
import { motion } from 'framer-motion';
import { GrRevert } from 'react-icons/gr';

const RevertConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
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
            <div className="p-3 rounded-full bg-green-50 mb-4">
              <GrRevert size={24} className="text-green-600" />
            </div>

            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Revert Quotation
            </h2>

            <p className="text-sm text-gray-500 mb-6 text-center">
              Are you sure you want to revert this cancelled quotation? This
              will make the quotation active again.
            </p>

            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none"
              >
                Revert
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RevertConfirmationModal;
