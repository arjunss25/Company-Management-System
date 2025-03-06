import React from 'react';
import Modal from '../../Common/Modal'; 
import { XCircle } from 'lucide-react'; // Using lucide-react for icons

const ErrorModal = ({ isOpen, onClose, message, errors = {} }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="p-6">
      <div className="w-16 h-16 rounded-full bg-red-100 mx-auto mb-4 flex items-center justify-center">
        <XCircle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">
        Error!
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

export default ErrorModal;
