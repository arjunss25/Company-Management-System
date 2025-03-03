import React, { useState } from 'react';
import { MdAddCircle, MdClose } from 'react-icons/md';
import { FaEye, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AdminApi } from '../../../Services/AdminApi';

const NotificationModal = ({ isOpen, onClose, type, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 md:p-6">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">
        <div className="flex flex-col items-center text-center">
          {type === 'success' ? (
            <FaCheckCircle className="text-green-500 text-5xl mb-4" />
          ) : (
            <FaTimesCircle className="text-red-500 text-5xl mb-4" />
          )}
          <h3
            className={`text-xl font-semibold mb-2 ${
              type === 'success' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {type === 'success' ? 'Success!' : 'Error!'}
          </h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-lg text-white font-medium
              ${
                type === 'success'
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
  );
};

const TermsModal = ({ isOpen, onClose, title }) => {
  const [terms, setTerms] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    isOpen: false,
    type: '',
    message: '',
  });

  // Reset states when modal is closed
  const handleClose = () => {
    setTerms('');
    setNotification({
      isOpen: false,
      type: '',
      message: '',
    });
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!terms.trim()) {
      setNotification({
        isOpen: true,
        type: 'error',
        message: 'Please enter terms and conditions',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await AdminApi.addTermsAndConditions({
        title: terms,
      });
      setNotification({
        isOpen: true,
        type: 'success',
        message: 'Terms and conditions added successfully',
      });
      setTerms('');
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error) {
      setNotification({
        isOpen: true,
        type: 'error',
        message:
          error.response?.data?.message || 'Failed to add terms and conditions',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, isOpen: false }));
    if (notification.type === 'success') {
      handleClose();
    }
  };

  // Reset notification when modal is opened
  React.useEffect(() => {
    if (isOpen) {
      setNotification({
        isOpen: false,
        type: '',
        message: '',
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 md:p-6">
        <div
          className="bg-white rounded-2xl w-full max-h-[90vh] overflow-hidden 
                      max-w-[95%] sm:max-w-[85%] md:max-w-2xl shadow-xl
                      flex flex-col"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b shrink-0">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 pr-4">
              Create {title}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
            >
              <MdClose size={24} />
            </button>
          </div>

          {/* Modal Body */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
              <textarea
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                placeholder={`Enter ${title.toLowerCase()} here...`}
                className="w-full h-[calc(100vh-350px)] sm:h-64 md:h-80 p-4 border border-gray-200 
                           rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                           outline-none transition-all resize-none text-gray-700 text-base sm:text-lg"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 border-t shrink-0 bg-white">
              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 rounded-lg border border-gray-300 
                           text-gray-700 hover:bg-gray-50 transition-all duration-200
                           text-base sm:text-lg font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 rounded-lg bg-blue-500 
                           text-white hover:bg-blue-600 transition-all duration-200
                           text-base sm:text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : `Save ${title}`}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        type={notification.type}
        message={notification.message}
      />
    </>
  );
};

const TermsandConditionDashboard = () => {
  const navigate = useNavigate();
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
  });

  const sections = [
    {
      title: 'General Terms & Conditions',
      addCount: '44',
      viewPath: '/admin/general-terms',
    },
    {
      title: 'Payment Terms',
      addCount: '33',
      viewPath: '/admin/payment-terms',
    },
    {
      title: 'Completion & Delivery',
      addCount: '50',
      viewPath: '/admin/completion-delivery',
    },
    {
      title: 'Quotation Validity',
      addCount: '43',
      viewPath: '/admin/quotation-validity',
    },
    {
      title: 'Warranty',
      addCount: '50',
      viewPath: '/admin/warranty-terms',
    },
  ];

  const handleAddClick = (title) => {
    setModalConfig({
      isOpen: true,
      title: title,
    });
  };

  return (
    <div className="w-full flex">
      <div className="main-content w-full h-full ">
        {/* Title Section */}
        <div className="w-full h-[12vh] flex items-center justify-center px-8">
          <h1 className="text-[2rem] font-bold text-gray-800">
            Terms & Condition Dashboard
          </h1>
        </div>

        {/* Sections Grid */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {sections.map((section, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b">
                  {section.title}
                </h2>

                <div className="flex gap-4 justify-between">
                  {/* Add Card */}
                  <div
                    onClick={() => handleAddClick(section.title)}
                    className="flex-1 bg-white rounded-xl border hover:border-blue-500 p-6 cursor-pointer 
                              group transition-all duration-300 flex flex-col items-center justify-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                      <MdAddCircle className="text-blue-500 text-2xl" />
                    </div>
                    <span className="text-gray-600 font-medium group-hover:text-blue-500 transition-colors">
                      Add
                    </span>
                  </div>

                  {/* View Card */}
                  <div
                    onClick={() => navigate(section.viewPath)}
                    className="flex-1 bg-white rounded-xl border hover:border-green-500 p-6 cursor-pointer 
                              group transition-all duration-300 flex flex-col items-center justify-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-3">
                      <FaEye className="text-green-500 text-2xl" />
                    </div>
                    <span className="text-2xl font-bold text-gray-800 mb-1">
                      {section.addCount}
                    </span>
                    <span className="text-gray-600 font-medium group-hover:text-green-500 transition-colors">
                      View
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Terms Modal */}
      <TermsModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ isOpen: false, title: '' })}
        title={modalConfig.title}
      />
    </div>
  );
};

export default TermsandConditionDashboard;
