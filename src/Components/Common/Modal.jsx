import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, children, type = 'success' }) => {
  if (!isOpen) return null;

  const overlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={overlayClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-modal-pop">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
};

export const SuccessModal = ({ isOpen, onClose, message }) => (
  <Modal isOpen={isOpen} onClose={onClose} type="success">
    <div className="p-6">
      <div className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">
        Success!
      </h3>
      <p className="text-center text-gray-600">{message}</p>
      <button
        onClick={onClose}
        className="mt-6 w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
      >
        Continue
      </button>
    </div>
  </Modal>
);

export const ErrorModal = ({ isOpen, onClose, message, errors = {} }) => (
  <Modal isOpen={isOpen} onClose={onClose} type="error">
    <div className="p-6">
      <div className="w-16 h-16 rounded-full bg-red-100 mx-auto mb-4 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">
        Registration Failed
      </h3>
      <p className="text-center text-gray-600 mb-4">{message}</p>
      {Object.entries(errors).length > 0 && (
        <div className="bg-red-50 p-3 rounded-lg">
          {Object.entries(errors).map(([field, error]) => (
            <p key={field} className="text-sm text-red-600">
              <span className="font-medium">{field}:</span> {error}
            </p>
          ))}
        </div>
      )}
      <button
        onClick={onClose}
        className="mt-6 w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
      >
        Try Again
      </button>
    </div>
  </Modal>
);

export default Modal; 