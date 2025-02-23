import React, { useState } from 'react';
import { SuperadminApi } from '../../Services/SuperadminApi';
import Spinner from '../../Components/Common/Spinner';
import { SuccessModal, ErrorModal } from '../../Components/Common/Modal';

const AddCompany = () => {
  const [formData, setFormData] = useState({
    company_name: '',
    address: '',
    description: '',
    logo_image: null,
    registration_date: '',
    license_number: '',
    phone: '',
    abbrevation: '',
  });
  const [loading, setLoading] = useState(false);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorDetails, setErrorDetails] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        logo_image: file,
      }));
      // Create preview URL
      setPreviewLogo(URL.createObjectURL(file));
    }
  };

  const formatDateForAPI = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitFormData = new FormData();
      const formattedDate = formatDateForAPI(formData.registration_date);
      
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          if (key === 'registration_date') {
            submitFormData.append(key, formattedDate);
          } else {
            submitFormData.append(key, formData[key]);
          }
        }
      });

      const response = await SuperadminApi.registerCompany(submitFormData);
      setShowSuccessModal(true);
      handleReset();
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message;
      
      if (typeof errorMessage === 'object') {
        setErrorDetails(errorMessage);
        setErrorMessage('Please check the form for errors.');
      } else {
        setErrorMessage(errorMessage || 'Failed to register company');
        setErrorDetails({});
      }
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      company_name: '',
      address: '',
      description: '',
      logo_image: null,
      registration_date: '',
      license_number: '',
      phone: '',
      abbrevation: '',
    });
    setPreviewLogo(null);
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-2 text-gray-600 font-medium">
            Company Name
          </label>
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleInputChange}
            placeholder="Enter Company Name"
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-600 font-medium">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter Address"
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-600 font-medium">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter Description"
            rows="3"
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-600 font-medium">Logo</label>
          <div className="space-y-2">
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full p-3 border border-gray-200 rounded-lg"
              required
            />
            {previewLogo && (
              <div className="mt-2">
                <img
                  src={previewLogo}
                  alt="Logo Preview"
                  className="h-20 w-20 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block mb-2 text-gray-600 font-medium">
            Date Of Registration
          </label>
          <input
            type="date"
            name="registration_date"
            value={formData.registration_date}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-600 font-medium">
            License Number
          </label>
          <input
            type="text"
            name="license_number"
            value={formData.license_number}
            onChange={handleInputChange}
            placeholder="Enter License Number"
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-600 font-medium">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Enter Phone Number"
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-600 font-medium">
            Abbreviation
          </label>
          <input
            type="text"
            name="abbrevation"
            value={formData.abbrevation}
            onChange={handleInputChange}
            placeholder="Enter Abbreviation"
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'
            } text-white px-6 py-3 rounded-lg transition-colors duration-300 flex items-center justify-center`}
          >
            {loading ? (
              <>
                <Spinner size="sm" />
                <span className="ml-2">Submitting...</span>
              </>
            ) : (
              'Submit'
            )}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors duration-300"
          >
            Reset
          </button>
        </div>
      </form>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message="Company has been successfully registered!"
      />

      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        message={errorMessage}
        errors={errorDetails}
      />
    </>
  );
};

export default AddCompany;
