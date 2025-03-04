import React, { useState, useEffect } from 'react';
import { AdminApi } from '../../../Services/AdminApi';

const AddClientModal = ({
  isOpen,
  handleClose,
  handleAddClient,
  companyId,
}) => {
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
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentSearchTerm, setPaymentSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchingPayment, setIsSearchingPayment] = useState(false);
  const [showTermsDropdown, setShowTermsDropdown] = useState(false);
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchTermsData();
    }
  }, [isOpen]);

  useEffect(() => {
    const searchTerms = async () => {
      if (searchTerm.length > 0) {
        setIsSearching(true);
        try {
          const response = await AdminApi.searchTerms(searchTerm);
          if (response.status === 'Success') {
            setGeneralTerms(response.data || []);
          }
        } catch (error) {
          console.error('Error searching terms:', error);
          setGeneralTerms([]);
        }
        setIsSearching(false);
      } else {
        fetchTermsData();
      }
    };

    const debounceTimer = setTimeout(searchTerms, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  useEffect(() => {
    const searchPaymentTerms = async () => {
      if (paymentSearchTerm.length > 0) {
        setIsSearchingPayment(true);
        try {
          const response = await AdminApi.searchPaymentTerms(paymentSearchTerm);
          if (response.status === 'Success') {
            setPaymentTerms(response.data || []);
          }
        } catch (error) {
          console.error('Error searching payment terms:', error);
          setPaymentTerms([]);
        }
        setIsSearchingPayment(false);
      } else {
        fetchTermsData();
      }
    };

    const debounceTimer = setTimeout(searchPaymentTerms, 300);
    return () => clearTimeout(debounceTimer);
  }, [paymentSearchTerm]);

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
      setNotification({
        isOpen: true,
        type: 'error',
        message: 'Failed to fetch terms data',
      });
    } finally {
      setIsLoading(false);
    }
  };

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
          handleClose();
        } else {
          throw new Error(response.message || 'Failed to add client');
        }
      } catch (error) {
        setNotification({
          isOpen: true,
          type: 'error',
          message: error.message || 'Failed to add client',
        });
      } finally {
        setIsLoading(false);
      }
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

  const closeNotification = () => {
    setNotification({ isOpen: false, type: '', message: '' });
  };

  if (!isOpen) return null;

  return (
    <>
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
                  <p className="mt-1 text-red-500 text-sm">
                    {errors.clientName}
                  </p>
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
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Terms & Conditions
                  </label>
                  <div className="relative">
                    <div
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
                      onClick={() => setShowTermsDropdown(!showTermsDropdown)}
                    >
                      {formData.termsAndConditions
                        ? generalTerms.find(
                            (term) => term.id === formData.termsAndConditions
                          )?.title || 'Select Terms'
                        : 'Select Terms'}
                    </div>
                    {showTermsDropdown && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                        <div className="p-2 border-b">
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Search terms..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                          {isSearching ? (
                            <div className="p-3 text-center text-gray-500">
                              Searching...
                            </div>
                          ) : searchTerm && generalTerms.length === 0 ? (
                            <div className="p-4 text-center">
                              <div className="text-gray-400">
                                <svg
                                  className="w-6 h-6 mx-auto mb-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <div className="text-sm font-medium text-gray-600">
                                  "{searchTerm}" not found
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                  No terms match your search
                                </div>
                              </div>
                            </div>
                          ) : generalTerms.length > 0 ? (
                            generalTerms.map((term) => (
                              <div
                                key={term.id}
                                className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${
                                  formData.termsAndConditions === term.id
                                    ? 'bg-blue-50'
                                    : ''
                                }`}
                                onClick={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    termsAndConditions: term.id,
                                  }));
                                  setShowTermsDropdown(false);
                                  setSearchTerm('');
                                }}
                              >
                                {term.title}
                              </div>
                            ))
                          ) : (
                            <div className="p-3 text-center text-gray-500">
                              Start typing to search terms
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.termsAndConditions && (
                    <p className="mt-1 text-red-500 text-sm">
                      {errors.termsAndConditions}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Terms
                  </label>
                  <div className="relative">
                    <div
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
                      onClick={() => setShowPaymentDropdown(!showPaymentDropdown)}
                    >
                      {formData.paymentTerms
                        ? paymentTerms.find(
                            (term) => term.id === formData.paymentTerms
                          )?.name || 'Select Payment Terms'
                        : 'Select Payment Terms'}
                    </div>
                    {showPaymentDropdown && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                        <div className="p-2 border-b">
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Search payment terms..."
                            value={paymentSearchTerm}
                            onChange={(e) => setPaymentSearchTerm(e.target.value)}
                          />
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                          {isSearchingPayment ? (
                            <div className="p-3 text-center text-gray-500">
                              Searching...
                            </div>
                          ) : paymentSearchTerm && paymentTerms.length === 0 ? (
                            <div className="p-4 text-center">
                              <div className="text-gray-400">
                                <svg
                                  className="w-6 h-6 mx-auto mb-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <div className="text-sm font-medium text-gray-600">
                                  "{paymentSearchTerm}" not found
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                  No payment terms match your search
                                </div>
                              </div>
                            </div>
                          ) : paymentTerms.length > 0 ? (
                            paymentTerms.map((term) => (
                              <div
                                key={term.id}
                                className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${
                                  formData.paymentTerms === term.id ? 'bg-blue-50' : ''
                                }`}
                                onClick={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    paymentTerms: term.id,
                                  }));
                                  setShowPaymentDropdown(false);
                                  setPaymentSearchTerm('');
                                }}
                              >
                                {term.name}
                              </div>
                            ))
                          ) : (
                            <div className="p-3 text-center text-gray-500">
                              Start typing to search payment terms
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.paymentTerms && (
                    <p className="mt-1 text-red-500 text-sm">{errors.paymentTerms}</p>
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
                  <p className="mt-1 text-red-500 text-sm">
                    {errors.attention}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-6 mt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/50 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Adding...' : 'Add Client'}
              </button>
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="px-6 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all text-sm font-medium text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Notification Modal */}
      {notification.isOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
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
                  notification.type === 'success'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {notification.type === 'success' ? 'Success!' : 'Error!'}
              </h3>
              <p className="text-gray-600 mb-6">{notification.message}</p>
              <button
                onClick={closeNotification}
                className={`px-6 py-2 rounded-lg text-white font-medium
                  ${
                    notification.type === 'success'
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-red-500 hover:bg-red-600'
                  }
                  transition-colors duration-200`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddClientModal;
