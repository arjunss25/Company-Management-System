import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';

const NotificationModal = ({ isOpen, onClose, message, type }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`bg-white rounded-2xl shadow-xl w-full max-w-md p-6 ${
              type === 'success' ? 'border-green-500' : 'border-red-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <h2
                className={`text-xl font-semibold ${
                  type === 'success' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {type === 'success' ? 'Success!' : 'Error!'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <IoClose size={24} />
              </button>
            </div>
            <p className="mt-4 text-gray-700">{message}</p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NotificationModal;
