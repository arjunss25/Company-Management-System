import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { RiErrorWarningLine } from 'react-icons/ri';

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Item',
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <IoClose size={20} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <RiErrorWarningLine className="text-red-600" size={24} />
              </div>
            </div>
            <p className="text-center text-gray-600 mb-6">{message}</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="px-6 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;
