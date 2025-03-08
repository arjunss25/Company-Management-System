import React, { useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';

const ClientModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    address: '',
    termsAndCondition: '',
    paymentTerms: '',
    attentions: [''],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAttentionChange = (index, value) => {
    setFormData((prev) => {
      const newAttentions = [...prev.attentions];
      newAttentions[index] = value;
      return {
        ...prev,
        attentions: newAttentions,
      };
    });
  };

  const addAttentionField = () => {
    setFormData((prev) => ({
      ...prev,
      attentions: [...prev.attentions, ''],
    }));
  };

  const removeAttentionField = (index) => {
    setFormData((prev) => ({
      ...prev,
      attentions: prev.attentions.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleReset = () => {
    setFormData({
      clientName: '',
      address: '',
      termsAndCondition: '',
      paymentTerms: '',
      attentions: [''],
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add New Client</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <IoCloseOutline size={28} className="text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Client Name
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                placeholder="Enter client name"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter address"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Terms & Condition
              </label>
              <select
                name="termsAndCondition"
                value={formData.termsAndCondition}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
              >
                <option value="">Select terms</option>
                <option value="term1">Term 1</option>
                <option value="term2">Term 2</option>
                <option value="term3">Term 3</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Payment Terms
              </label>
              <select
                name="paymentTerms"
                value={formData.paymentTerms}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
              >
                <option value="">Select payment terms</option>
                <option value="30days">30 Days</option>
                <option value="60days">60 Days</option>
                <option value="90days">90 Days</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              Attention
            </label>
            {formData.attentions.map((attention, index) => (
              <div key={index} className="grid grid-cols-12 gap-3">
                <div className="col-span-10">
                  <input
                    type="text"
                    value={attention}
                    onChange={(e) =>
                      handleAttentionChange(index, e.target.value)
                    }
                    placeholder="Enter attention details"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div className="col-span-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => addAttentionField()}
                    className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                  >
                    <span className="text-xl">+</span>
                  </button>
                  {formData.attentions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAttentionField(index)}
                      className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                    >
                      <span className="text-xl">−</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm shadow-blue-200"
            >
              Save Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientModal;
