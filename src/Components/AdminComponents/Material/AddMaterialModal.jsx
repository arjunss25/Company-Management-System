import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';

const AddMaterialModal = ({ isOpen, onClose }) => {
  const [materialName, setMaterialName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    setError('');

    // Validation
    if (!materialName.trim()) {
      setError('Material name is required');
      return;
    }
    setMaterialName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl w-[400px] shadow-xl transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <h2 className="text-2xl font-semibold text-gray-800">Add Material</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <IoClose size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 pt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Material Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={materialName}
              onChange={(e) => {
                setMaterialName(e.target.value);
                setError('');
              }}
              placeholder="Enter material name"
              className={`w-full px-4 py-3 border rounded-xl
                       outline-none transition-all text-gray-800
                       placeholder:text-gray-400
                       ${
                         error
                           ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                           : 'border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                       }`}
            />
            {error && (
              <p className="text-red-500 text-sm mt-1 animate-fadeIn">
                {error}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-500 text-white rounded-xl
                       hover:bg-blue-600 transition-colors font-medium"
            >
              Add Material
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMaterialModal;
