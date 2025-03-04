import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AdminApi } from '../../../Services/AdminApi';

const ClientEditModal = ({ client, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    company_id: client.company_id,
    clientName: client.clientName,
    address: client.address,
    terms: client.terms,
    payment: client.payment,
    attentions: client.attentions || [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [termsOptions, setTermsOptions] = useState([]);
  const [paymentOptions, setPaymentOptions] = useState([]);

  // Fetch terms and payment options on mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [termsResponse, paymentResponse] = await Promise.all([
          AdminApi.listTermsAndConditions(),
          AdminApi.listPaymentTerms(),
        ]);
        setTermsOptions(termsResponse.data || []);
        setPaymentOptions(paymentResponse.data || []);
      } catch (error) {
        console.error('Error fetching options:', error);
        setError('Failed to load form options');
      }
    };
    fetchOptions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAttentionChange = (index, value) => {
    const newAttentions = [...formData.attentions];
    newAttentions[index] = { ...newAttentions[index], name: value };
    setFormData((prev) => ({
      ...prev,
      attentions: newAttentions,
    }));
  };

  const addAttention = () => {
    setFormData((prev) => ({
      ...prev,
      attentions: [...prev.attentions, { name: '' }],
    }));
  };

  const removeAttention = (index) => {
    setFormData((prev) => ({
      ...prev,
      attentions: prev.attentions.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await AdminApi.updateClient(client.id, formData);
      if (response.status === 'Success') {
        onSave(response.data);
      } else {
        setError('Failed to update client');
      }
    } catch (error) {
      setError('Error updating client: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 overflow-hidden h-[80vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Edit Client</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-lg">{error}</div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Name
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Terms & Conditions
                </label>
                <select
                  name="terms"
                  value={formData.terms}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Terms</option>
                  {termsOptions.map((term) => (
                    <option key={term.id} value={term.id}>
                      {term.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Terms
                </label>
                <select
                  name="payment"
                  value={formData.payment}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Payment Terms</option>
                  {paymentOptions.map((term) => (
                    <option key={term.id} value={term.id}>
                      {term.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attention
              </label>
              <div className="space-y-3">
                {formData.attentions.map((attention, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={attention.name}
                      onChange={(e) =>
                        handleAttentionChange(index, e.target.value)
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Contact person name"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeAttention(index)}
                      className="px-3 py-2 text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addAttention}
                  className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                >
                  + Add Contact Person
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ClientEditModal;
