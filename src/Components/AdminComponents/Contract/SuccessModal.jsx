import React from 'react';
import Modal from '../../Common/Modal';
import { CheckCircle } from 'lucide-react';

const SuccessModal = ({ isOpen, onClose, message, onContinue }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="p-6">
      <div className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center">
        <CheckCircle className="w-8 h-8 text-green-500" />
      </div>
      <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">
        Success!
      </h3>
      <p className="text-center text-gray-600">{message}</p>
      <button
        onClick={onContinue || onClose}
        className="mt-6 w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
      >
        Continue
      </button>
    </div>
  </Modal>
);

export default SuccessModal;
