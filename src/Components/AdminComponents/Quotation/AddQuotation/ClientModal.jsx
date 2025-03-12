import React, { useState, useEffect, useRef } from 'react';
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

  const [searchTerm, setSearchTerm] = useState('');
  const [paymentSearchTerm, setPaymentSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchingPayment, setIsSearchingPayment] = useState(false);
  const [showTermsDropdown, setShowTermsDropdown] = useState(false);
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);

  const dropdownRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowTermsDropdown(false);
        setShowPaymentDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
            message: 'Client added successfully'
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
          message: error.message || 'Failed to create client'
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

  const handleDropdownClick = (dropdownName) => {
    if (dropdownName === 'terms') {
      setShowTermsDropdown(prev => !prev);
      setShowPaymentDropdown(false);
    } else if (dropdownName === 'payment') {
      setShowPaymentDropdown(prev => !prev);
      setShowTermsDropdown(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Main Modal */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" ref={dropdownRef}>
              <div className="space-y-2">
                <div className="relative">
                <label className="block text-sm font-semibold text-gray-700">
                  Terms & Conditions
                </label>
                  <div className="relative">
                    <div
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer flex justify-between items-center"
                      onClick={() => handleDropdownClick('terms')}
                    >
                      <span className="truncate">
                        {formData.termsAndConditions
                          ? generalTerms.find(term => term.id === formData.termsAndConditions)?.title
                          : 'Select terms'}
                      </span>
                      <svg
                        className={`w-5 h-5 text-gray-500 transition-transform ${
                          showTermsDropdown ? 'transform rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
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
                            <div className="p-3 text-center text-gray-500">Searching...</div>
                          ) : searchTerm && generalTerms.length === 0 ? (
                            <div className="p-4 text-center">
                              <div className="text-gray-400">
                                <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="text-sm font-medium text-gray-600">"{searchTerm}" not found</div>
                                <div className="text-xs text-gray-400 mt-1">No terms match your search</div>
                              </div>
                            </div>
                          ) : (
                            generalTerms.map((term) => (
                              <div
                                key={term.id}
                                className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${
                                  formData.termsAndConditions === term.id ? 'bg-blue-50' : ''
                                }`}
                                onClick={() => {
                                  handleInputChange({ target: { name: 'termsAndConditions', value: term.id } });
                                  setShowTermsDropdown(false);
                                  setSearchTerm('');
                                }}
                              >
                      {term.title}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                <label className="block text-sm font-semibold text-gray-700">
                  Payment Terms
                </label>
                  <div className="relative">
                    <div
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer flex justify-between items-center"
                      onClick={() => handleDropdownClick('payment')}
                    >
                      <span className="truncate">
                        {formData.paymentTerms
                          ? paymentTerms.find(term => term.id === formData.paymentTerms)?.name
                          : 'Select payment terms'}
                      </span>
                      <svg
                        className={`w-5 h-5 text-gray-500 transition-transform ${
                          showPaymentDropdown ? 'transform rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
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
                            <div className="p-3 text-center text-gray-500">Searching...</div>
                          ) : paymentSearchTerm && paymentTerms.length === 0 ? (
                            <div className="p-4 text-center">
                              <div className="text-gray-400">
                                <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="text-sm font-medium text-gray-600">"{paymentSearchTerm}" not found</div>
                                <div className="text-xs text-gray-400 mt-1">No payment terms match your search</div>
                              </div>
                            </div>
                          ) : (
                            paymentTerms.map((term) => (
                              <div
                                key={term.id}
                                className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${
                                  formData.paymentTerms === term.id ? 'bg-blue-50' : ''
                                }`}
                                onClick={() => {
                                  handleInputChange({ target: { name: 'paymentTerms', value: term.id } });
                                  setShowPaymentDropdown(false);
                                  setPaymentSearchTerm('');
                                }}
                              >
                      {term.name}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
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

      {/* Notification Modal */}
      {notification.isOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-8 shadow-xl transform transition-all">
            <div className="flex flex-col items-center text-center">
              {notification.type === 'success' ? (
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                </div>
              ) : (
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
                </div>
              )}
              <h3 className={`text-2xl font-bold mb-2 ${notification.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {notification.type === 'success' ? 'Success!' : 'Error!'}
              </h3>
              <p className="text-gray-600 mb-8">{notification.message}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setNotification({ isOpen: false, type: '', message: '' })}
                  className={`px-6 py-2.5 rounded-xl text-white font-medium transition-colors ${
                    notification.type === 'success'
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClientModal;
