import React, { useState, useEffect } from 'react';
import {
  IoChevronDownOutline,
  IoAddOutline,
  IoSearchOutline,
} from 'react-icons/io5';
import { AdminApi } from '../../../../Services/AdminApi';
import {
  listQuotationValidityTerms,
  addQuotationValidityTerm,
  listWarrantyTerms,
  addWarrantyTerm,
  addQuotationTerms,
  addNarration,
} from '../../../../Services/QuotationApi';
import { useSelector } from 'react-redux';
import { selectQuotationId } from '../../../../store/slices/quotationSlice';

const TermsAndConditions = () => {
  const [options, setOptions] = useState({
    general: [],
    payment: [],
    completion: [],
    validity: [],
    warranty: [],
  });

  const sections = [
    {
      id: 'general',
      title: 'General Terms & Condition',
    },
    {
      id: 'payment',
      title: 'Payment Terms',
    },
    {
      id: 'completion',
      title: 'Completion & Delivery',
    },
    {
      id: 'validity',
      title: 'Quotation Validity',
    },
    {
      id: 'warranty',
      title: 'Warranty',
    },
  ];

  const [openSection, setOpenSection] = useState(null);
  const [selectedTerms, setSelectedTerms] = useState({
    general: [],
    payment: [],
    completion: [],
    validity: [],
    warranty: [],
  });
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newTerm, setNewTerm] = useState('');
  const [selectedModalItems, setSelectedModalItems] = useState([]);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTermIds, setSelectedTermIds] = useState({
    terms: [],
    payment: [],
    delivery: [],
    validity: [],
    warranty: [],
  });
  const [narration, setNarration] = useState('');
  const quotationId = useSelector(selectQuotationId);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleTermChange = (sectionId, index, value) => {
    setSelectedTerms((prev) => ({
      ...prev,
      [sectionId]: prev[sectionId].map((term, i) =>
        i === index ? value : term
      ),
    }));
  };

  const handleRemoveTerm = (sectionId, index) => {
    setSelectedTerms((prev) => ({
      ...prev,
      [sectionId]: prev[sectionId].filter((_, i) => i !== index),
    }));
  };

  const handleOpenSelectModal = (sectionId) => {
    setCurrentSection(sectionId);
    setIsSelectModalOpen(true);
    setSearchQuery('');
  };

  const handleOpenCreateModal = (sectionId) => {
    setCurrentSection(sectionId);
    setIsCreateModalOpen(true);
    setNewTerm('');
  };

  const handleCreateTerm = async () => {
    if (newTerm.trim()) {
      try {
        let response;
        console.log('Current Section:', currentSection);
        console.log('New Term Value:', newTerm.trim());

        if (currentSection === 'general') {
          const payload = { title: newTerm.trim() };
          console.log('General Terms Payload:', payload);
          response = await AdminApi.addTermsAndConditions(payload);
        } else if (currentSection === 'payment') {
          const payload = { name: newTerm.trim() };
          console.log('Payment Terms Payload:', payload);
          response = await AdminApi.addPaymentTerms(payload);
        } else if (currentSection === 'completion') {
          const completionPayload = { delivery: newTerm.trim() };
          console.log('Completion Terms Payload:', completionPayload);
          console.log('API Function:', AdminApi.addCompletionTerms);
          response = await AdminApi.addCompletionTerms(completionPayload);
        } else if (currentSection === 'validity') {
          console.log('Validity Terms Payload:', newTerm.trim());
          response = await addQuotationValidityTerm(newTerm.trim());
        } else if (currentSection === 'warranty') {
          console.log('Warranty Terms Payload:', newTerm.trim());
          response = await addWarrantyTerm(newTerm.trim());
        }

        console.log('API Response:', response);

        setSelectedTerms((prev) => ({
          ...prev,
          [currentSection]: [...prev[currentSection], newTerm.trim()],
        }));

        const newOption = {
          id: response.data.id,
          ...(currentSection === 'general' && { title: newTerm.trim() }),
          ...(currentSection === 'payment' && { name: newTerm.trim() }),
          ...(currentSection === 'completion' && { delivery: newTerm.trim() }),
          ...(currentSection === 'validity' && { validity: newTerm.trim() }),
          ...(currentSection === 'warranty' && { warranty: newTerm.trim() }),
        };

        setOptions((prevOptions) => ({
          ...prevOptions,
          [currentSection]: [...prevOptions[currentSection], newOption],
        }));

        const sectionToPayloadKey = {
          general: 'terms',
          payment: 'payment',
          completion: 'delivery',
          validity: 'validity',
          warranty: 'warranty',
        };

        const payloadKey = sectionToPayloadKey[currentSection];
        setSelectedTermIds((prev) => ({
          ...prev,
          [payloadKey]: [...prev[payloadKey], response.data.id],
        }));

        setStatusMessage({
          type: 'success',
          message: `${
            currentSection.charAt(0).toUpperCase() + currentSection.slice(1)
          } term added successfully!`,
        });
        setShowStatusModal(true);
        setIsCreateModalOpen(false);
        setNewTerm('');

        if (currentSection === 'completion') {
          const refreshResponse = await AdminApi.listCompletionTerms();
          if (refreshResponse.data) {
            setOptions((prevOptions) => ({
              ...prevOptions,
              completion: refreshResponse.data.map((term) => ({
                id: term.id,
                delivery: term.delivery,
              })),
            }));
          }
        } else if (currentSection === 'general') {
          const refreshResponse = await AdminApi.listTermsAndConditions();
          if (refreshResponse.data) {
            setOptions((prevOptions) => ({
              ...prevOptions,
              general: refreshResponse.data.map((term) => ({
                id: term.id,
                title: term.title,
              })),
            }));
          }
        } else if (currentSection === 'payment') {
          const refreshResponse = await AdminApi.listPaymentTerms();
          if (refreshResponse.data) {
            setOptions((prevOptions) => ({
              ...prevOptions,
              payment: refreshResponse.data.map((term) => ({
                id: term.id,
                name: term.name,
              })),
            }));
          }
        }
      } catch (error) {
        console.error('Error Details:', {
          error,
          response: error.response,
          data: error.response?.data,
          status: error.response?.status,
        });

        setIsCreateModalOpen(false);
        let errorMessage;
        if (error.response?.data?.message) {
          console.log('Error Message Structure:', error.response.data.message);
          if (typeof error.response.data.message === 'object') {
            errorMessage = Object.entries(error.response.data.message)
              .map(([key, value]) => `${key}: ${value.join(', ')}`)
              .join('; ');
          } else {
            errorMessage = error.response.data.message;
          }
        } else {
          errorMessage = `Failed to add ${currentSection} term`;
        }

        setStatusMessage({
          type: 'error',
          message: errorMessage,
        });
        setShowStatusModal(true);
      }
    }
  };

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        // Fetch general terms
        const generalResponse = await AdminApi.listTermsAndConditions();
        if (generalResponse.data) {
          setOptions((prevOptions) => ({
            ...prevOptions,
            general: generalResponse.data.map((term) => ({
              id: term.id,
              title: term.title,
            })),
          }));
        }

        // Fetch payment terms
        const paymentResponse = await AdminApi.listPaymentTerms();
        if (paymentResponse.data) {
          setOptions((prevOptions) => ({
            ...prevOptions,
            payment: paymentResponse.data.map((term) => ({
              id: term.id,
              name: term.name,
            })),
          }));
        }

        // Fetch completion terms
        const completionResponse = await AdminApi.listCompletionTerms();
        if (completionResponse.data) {
          setOptions((prevOptions) => ({
            ...prevOptions,
            completion: completionResponse.data.map((term) => ({
              id: term.id,
              delivery: term.delivery,
            })),
          }));
        }

        // Fetch validity terms
        const validityResponse = await listQuotationValidityTerms();
        if (validityResponse.data) {
          setOptions((prevOptions) => ({
            ...prevOptions,
            validity: validityResponse.data.map((term) => ({
              id: term.id,
              validity: term.validity,
            })),
          }));
        }

        // Fetch warranty terms
        const warrantyResponse = await listWarrantyTerms();
        if (warrantyResponse.data) {
          setOptions((prevOptions) => ({
            ...prevOptions,
            warranty: warrantyResponse.data.map((term) => ({
              id: term.id,
              warranty: term.warranty,
            })),
          }));
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching terms:', error);
        setStatusMessage({
          type: 'error',
          message: 'Failed to fetch terms',
        });
        setShowStatusModal(true);
        setIsLoading(false);
      }
    };

    fetchTerms();
  }, []);

  const filteredOptions = currentSection
    ? options[currentSection].filter((option) => {
        const text =
          option.title ||
          option.name ||
          option.delivery ||
          option.validity ||
          option.warranty;
        return text.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : [];

  const getOptionText = (option) => {
    return (
      option.title ||
      option.name ||
      option.delivery ||
      option.validity ||
      option.warranty
    );
  };

  const handleSaveTerms = async () => {
    try {
      const payload = {
        terms: selectedTermIds.terms,
        payment: selectedTermIds.payment,
        delivery: selectedTermIds.delivery,
        validity: selectedTermIds.validity,
        warranty: selectedTermIds.warranty,
      };

      const response = await addQuotationTerms(payload);
      setStatusMessage({
        type: 'success',
        message: 'Terms and conditions saved successfully!',
      });
      setShowStatusModal(true);
    } catch (error) {
      setStatusMessage({
        type: 'error',
        message:
          error.response?.data?.message ||
          'Failed to save terms and conditions',
      });
      setShowStatusModal(true);
    }
  };

  const handleSelectModalSubmit = () => {
    const selectedIds = selectedModalItems.map((item) => item.id);

    const sectionToPayloadKey = {
      general: 'terms',
      payment: 'payment',
      completion: 'delivery',
      validity: 'validity',
      warranty: 'warranty',
    };

    const payloadKey = sectionToPayloadKey[currentSection];

    setSelectedTermIds((prev) => ({
      ...prev,
      [payloadKey]: selectedIds,
    }));

    const selectedTexts = selectedModalItems.map((item) => {
      if (currentSection === 'general') return item.title;
      if (currentSection === 'payment') return item.name;
      if (currentSection === 'completion') return item.delivery;
      if (currentSection === 'validity') return item.validity;
      if (currentSection === 'warranty') return item.warranty;
      return '';
    });

    setSelectedTerms((prev) => ({
      ...prev,
      [currentSection]: selectedTexts,
    }));

    setSelectedModalItems([]);
    setIsSelectModalOpen(false);
  };

  const handleSaveNarration = async () => {
    try {
      const payload = {
        quotation: quotationId,
        narration: narration.trim(),
      };

      const response = await addNarration(payload);
      setStatusMessage({
        type: 'success',
        message: 'Narration saved successfully!',
      });
      setShowStatusModal(true);
    } catch (error) {
      setStatusMessage({
        type: 'error',
        message: error.response?.data?.message || 'Failed to save narration',
      });
      setShowStatusModal(true);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          sections.map((section) => (
            <div
              key={section.id}
              className={`border rounded-lg transition-all ${
                openSection === section.id
                  ? 'border-blue-500'
                  : 'border-gray-200'
              }`}
            >
              <button
                className="w-full px-6 py-4 flex justify-between items-center text-left"
                onClick={() => toggleSection(section.id)}
              >
                <span className="text-gray-700 font-medium">
                  {section.title}
                </span>
                <IoChevronDownOutline
                  className={`text-gray-500 transition-transform duration-200 ${
                    openSection === section.id ? 'rotate-180' : ''
                  }`}
                  size={20}
                />
              </button>

              {openSection === section.id && (
                <div className="px-6 py-4 border-t space-y-4">
                  {selectedTerms[section.id].map((term, index) => (
                    <div key={index} className="flex gap-4 items-start">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={term}
                          onChange={(e) =>
                            handleTermChange(section.id, index, e.target.value)
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveTerm(section.id, index)}
                        className="px-3 py-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => handleOpenSelectModal(section.id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                    >
                      Select {section.title}
                    </button>
                    <button
                      onClick={() => handleOpenCreateModal(section.id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-green-500 hover:text-green-700 hover:bg-green-50 transition-colors"
                    >
                      <IoAddOutline size={20} />
                      Create New
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Select Modal */}
      {isSelectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl transform transition-all">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  Select {sections.find((s) => s.id === currentSection)?.title}
                </h3>
                <button
                  onClick={() => setIsSelectModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IoSearchOutline className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search terms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="max-h-[300px] overflow-y-auto mb-6 -mx-6 px-6">
                {filteredOptions.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedModalItems((prev) =>
                        prev.includes(option)
                          ? prev.filter((item) => item !== option)
                          : [...prev, option]
                      );
                    }}
                  >
                    <div
                      className={`w-5 h-5 border rounded-md mr-3 flex items-center justify-center transition-all
                        ${
                          selectedModalItems.includes(option)
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-gray-300'
                        }`}
                    >
                      {selectedModalItems.includes(option) && (
                        <svg
                          className="w-3.5 h-3.5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-gray-700 select-none">
                      {getOptionText(option)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setSelectedModalItems([]);
                    setIsSelectModalOpen(false);
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSelectModalSubmit}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl transform transition-all">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  Create New{' '}
                  {sections.find((s) => s.id === currentSection)?.title}
                </h3>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <textarea
                value={newTerm}
                onChange={(e) => {
                  console.log('Textarea value changed:', e.target.value);
                  setNewTerm(e.target.value);
                }}
                placeholder="Enter new term..."
                className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[120px] mb-6 resize-none transition-all"
              />

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTerm}
                  disabled={!newTerm.trim()}
                  className={`px-6 py-2 rounded-lg transition-colors font-medium shadow-sm
                    ${
                      newTerm.trim()
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="btn mt-5 w-full flex justify-end">
        <button
          onClick={handleSaveTerms}
          className="px-6 py-2.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all"
        >
          Save
        </button>
      </div>

      {/* Add narration section */}
      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-medium text-gray-700">Narration</h3>
        <textarea
          value={narration}
          onChange={(e) => setNarration(e.target.value)}
          placeholder="Enter narration..."
          className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[120px] resize-none transition-all"
        />
        <div className="flex justify-end">
          <button
            onClick={handleSaveNarration}
            disabled={!narration.trim()}
            className={`px-6 py-2.5 rounded-lg transition-all ${
              narration.trim()
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Save Narration
          </button>
        </div>
      </div>

      {/* Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl transform transition-all">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3
                  className={`text-xl font-semibold ${
                    statusMessage.type === 'success'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {statusMessage.type === 'success' ? 'Success' : 'Error'}
                </h3>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                {typeof statusMessage.message === 'string'
                  ? statusMessage.message
                  : 'An error occurred'}
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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

export default TermsAndConditions;
