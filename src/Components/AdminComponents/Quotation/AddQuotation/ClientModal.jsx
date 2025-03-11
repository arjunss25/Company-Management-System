import React, { useState, useEffect } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { AdminApi } from '../../../../Services/AdminApi';

const ClientModal = ({ isOpen, onClose, handleAddClient, companyId }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    address: '',
    termsAndConditions: '',
    paymentTerms: '',
    attention: [''],
    companyId: companyId || '',
  });

  const [errors, setErrors] = useState({});
  const [generalTerms, setGeneralTerms] = useState([]);
  const [paymentTerms, setPaymentTerms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    isOpen: false,
    type: '',
    message: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchTermsData();
    }
  }, [isOpen]);

  const fetchTermsData = async () => {
    try {
      setIsLoading(true);
      const [generalTermsResponse, paymentTermsResponse] = await Promise.all([
        AdminApi.listTermsAndConditions(),
        AdminApi.listPaymentTerms(),
      ]);

      if (generalTermsResponse.status === 'Success') {
        setGeneralTerms(generalTermsResponse.data || []);
      }
      if (paymentTermsResponse.status === 'Success') {
        setPaymentTerms(paymentTermsResponse.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch terms data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e, index = null) => {
    const { name, value } = e.target;
    if (name === 'attention') {
      const updatedAttention = [...formData.attention];
      updatedAttention[index] = value;
      setFormData(prev => ({ ...prev, attention: updatedAttention }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const addAttentionField = () => {
    setFormData(prev => ({
      ...prev,
      attention: [...prev.attention, ''],
    }));
  };

  const removeAttentionField = (index) => {
    setFormData(prev => ({
      ...prev,
      attention: prev.attention.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.clientName.trim()) newErrors.clientName = 'Client Name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.termsAndConditions) newErrors.termsAndConditions = 'Terms & Conditions are required';
    if (!formData.paymentTerms) newErrors.paymentTerms = 'Payment Terms are required';
    if (formData.attention.some(att => !att.trim())) newErrors.attention = 'All attention fields are required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setIsLoading(true);
        const response = await AdminApi.createClient(formData);
        if (response.status === 'Success') {
          setNotification({
            isOpen: true,
            type: 'success',
            message: 'Client added successfully',
          });
          handleAddClient(response.data);
          handleReset();
          setTimeout(() => {
            onClose();
            setNotification({ isOpen: false, type: '', message: '' });
          }, 2000);
        }
      } catch (error) {
        console.error('Error creating client:', error);
        setNotification({
          isOpen: true,
          type: 'error',
          message: error.message || 'Failed to create client',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleReset = () => {
    setFormData({
      clientName: '',
      address: '',
      termsAndConditions: '',
      paymentTerms: '',
      attention: [''],
      companyId: companyId || '',
    });
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl transform transition-all">
        {/* Header */}
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
          {/* Client Name and Address */}
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
                className={`w-full p-3 border ${errors.clientName ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
              />
              {errors.clientName && (
                <p className="text-red-500 text-sm mt-1">{errors.clientName}</p>
              )}
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
                className={`w-full p-3 border ${errors.address ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>
          </div>

          {/* Terms and Payment Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Terms & Conditions
              </label>
              <select
                name="termsAndConditions"
                value={formData.termsAndConditions}
                onChange={handleInputChange}
                className={`w-full p-3 border ${errors.termsAndConditions ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-white`}
              >
                <option value="">Select terms</option>
                {generalTerms.map((term) => (
                  <option key={term.id} value={term.id}>
                    {term.title}
                  </option>
                ))}
              </select>
              {errors.termsAndConditions && (
                <p className="text-red-500 text-sm mt-1">{errors.termsAndConditions}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Payment Terms
              </label>
              <select
                name="paymentTerms"
                value={formData.paymentTerms}
                onChange={handleInputChange}
                className={`w-full p-3 border ${errors.paymentTerms ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-white`}
              >
                <option value="">Select payment terms</option>
                {paymentTerms.map((term) => (
                  <option key={term.id} value={term.id}>
                    {term.name}
                  </option>
                ))}
              </select>
              {errors.paymentTerms && (
                <p className="text-red-500 text-sm mt-1">{errors.paymentTerms}</p>
              )}
            </div>
          </div>

          {/* Attention Fields */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              Attention
            </label>
            {formData.attention.map((attention, index) => (
              <div key={index} className="grid grid-cols-12 gap-3">
                <div className="col-span-10">
                  <input
                    type="text"
                    name="attention"
                    value={attention}
                    onChange={(e) => handleInputChange(e, index)}
                    placeholder="Enter attention details"
                    className={`w-full p-3 border ${errors.attention ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                  />
                </div>
                <div className="col-span-2 flex gap-2">
                  <button
                    type="button"
                    onClick={addAttentionField}
                    className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                  >
                    <span className="text-xl">+</span>
                  </button>
                  {formData.attention.length > 1 && (
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
            {errors.attention && (
              <p className="text-red-500 text-sm mt-1">{errors.attention}</p>
            )}
          </div>

          {/* Submit Error Message */}
          {errors.submit && (
            <p className="text-red-500 text-sm text-center">{errors.submit}</p>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={handleReset}
              disabled={isLoading}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm shadow-blue-200 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        {/* Existing modal content */}
      </div>

      {/* Notification Modal */}
      {notification.isOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">
            <div className="flex flex-col items-center text-center">
              {notification.type === 'success' ? (
                <svg
                  className="w-16 h-16 text-green-500 mb-4"
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
              ) : (
                <svg
                  className="w-16 h-16 text-red-500 mb-4"
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
              )}
              <h3
                className={`text-xl font-semibold mb-2 ${
                  notification.type === 'success' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {notification.type === 'success' ? 'Success!' : 'Error!'}
              </h3>
              <p className="text-gray-600 mb-6">{notification.message}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClientModal;
