import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const SuccessModal = ({ isOpen, message, onClose, isError = false }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="bg-white rounded-3xl w-[400px] shadow-xl p-6 text-center"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              {isError ? (
                <FaTimesCircle className="w-10 h-10 text-red-500" />
              ) : (
                <FaCheckCircle className="w-10 h-10 text-green-500" />
              )}
            </div>

            <h2 className="text-2xl font-semibold text-gray-800">
              {isError ? 'Error!' : 'Success!'}
            </h2>

            <p className="text-gray-600">
              {message || 'Operation completed successfully!'}
            </p>

            <button
              onClick={onClose}
              className={`mt-4 px-6 py-2.5 rounded-xl transition-colors duration-200 font-medium ${
                isError
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              Continue
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SuccessModal;
