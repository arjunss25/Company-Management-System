import React, { useState } from 'react';

const AddClientModal = ({ isOpen, handleClose, handleAddClient }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    address: '',
    termsAndConditions: '',
    paymentTerms: '',
    attention: [''],
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    if (name === 'attention') {
      const updatedAttention = [...formData.attention];
      updatedAttention[index] = value;
      setFormData((prevData) => ({ ...prevData, attention: updatedAttention }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.clientName.trim())
      newErrors.clientName = 'Client Name is required.';
    if (!formData.address.trim()) newErrors.address = 'Address is required.';
    if (!formData.termsAndConditions)
      newErrors.termsAndConditions = 'Terms & Conditions are required.';
    if (!formData.paymentTerms)
      newErrors.paymentTerms = 'Payment Terms are required.';
    if (formData.attention.some((attention) => !attention.trim()))
      newErrors.attention = 'Attention is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleAddClient(formData);
    }
  };

  const addAttentionField = () => {
    setFormData((prevData) => ({
      ...prevData,
      attention: [...prevData.attention, ''],
    }));
  };

  const removeAttentionField = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      attention: prevData.attention.filter((_, i) => i !== index),
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-3xl transform transition-all">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="bg-blue-100 p-2 rounded-lg mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </span>
          Add New Client
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Name
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Enter client name"
              />
              {errors.clientName && (
                <p className="mt-1 text-red-500 text-sm">{errors.clientName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Enter address"
              />
              {errors.address && (
                <p className="mt-1 text-red-500 text-sm">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Terms & Conditions
                </label>
                <select
                  name="termsAndConditions"
                  value={formData.termsAndConditions}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="">Select Terms</option>
                  <option value="Terms1">Terms 1</option>
                  <option value="Terms2">Terms 2</option>
                </select>
                {errors.termsAndConditions && (
                  <p className="mt-1 text-red-500 text-sm">
                    {errors.termsAndConditions}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Terms
                </label>
                <select
                  name="paymentTerms"
                  value={formData.paymentTerms}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="">Select Payment Terms</option>
                  <option value="Net30">Net 30</option>
                  <option value="Net60">Net 60</option>
                </select>
                {errors.paymentTerms && (
                  <p className="mt-1 text-red-500 text-sm">
                    {errors.paymentTerms}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attention
              </label>
              {formData.attention.map((value, index) => (
                <div key={index} className="flex items-center gap-3 mb-3">
                  <input
                    type="text"
                    name="attention"
                    value={value}
                    onChange={(e) => handleChange(e, index)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter contact name"
                  />
                  <button
                    type="button"
                    onClick={() => removeAttentionField(index)}
                    disabled={formData.attention.length === 1}
                    className={`p-2 rounded-full transition-colors w-10 h-10 flex-shrink-0 ${
                      formData.attention.length === 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-red-500 hover:text-red-700 hover:bg-red-50'
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addAttentionField}
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mt-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Another Contact
              </button>
              {errors.attention && (
                <p className="mt-1 text-red-500 text-sm">{errors.attention}</p>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-6 mt-6 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/50 transition-all text-sm font-medium"
            >
              Add Client
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all text-sm font-medium text-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClientModal;
