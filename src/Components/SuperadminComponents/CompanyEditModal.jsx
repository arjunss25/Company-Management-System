import React, { useState, useEffect } from 'react';
import Modal from '../Common/Modal';
import Spinner from '../Common/Spinner';
import { SuperadminApi } from '../../Services/SuperadminApi';

const CompanyEditModal = ({ isOpen, onClose, company, onSuccess }) => {
  const [formData, setFormData] = useState({
    company_name: '',
    address: '',
    description: '',
    registration_date: '',
    license_number: '',
    phone: '',
    abbrevation: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (company) {
      setFormData({
        company_name: company.company_name || '',
        address: company.address || '',
        description: company.description || '',
        registration_date: company.registration_date || '',
        license_number: company.license_number || '',
        phone: company.phone || '',
        abbrevation: company.abbrevation || '',
      });
    }
  }, [company]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await SuperadminApi.updateCompany(company.id, formData);
      if (response.status === 'Success') {
        onSuccess('Company updated successfully!');
        onClose();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update company');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-semibold text-gray-800">Edit Company</h2>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">Company Name</label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">Registration Date</label>
              <input
                type="text"
                name="registration_date"
                value={formData.registration_date}
                onChange={handleInputChange}
                placeholder="DD-MM-YYYY"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">License Number</label>
              <input
                type="text"
                name="license_number"
                value={formData.license_number}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">Abbreviation</label>
              <input
                type="text"
                name="abbrevation"
                value={formData.abbrevation}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </form>
        </div>

        <div className="p-6 border-t bg-gray-50">
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
              className={`flex-1 py-2.5 px-4 rounded-lg text-white ${
                loading ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'
              } transition-colors duration-200`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Spinner size="sm" />
                  <span className="ml-2">Updating...</span>
                </div>
              ) : (
                'Update Company'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CompanyEditModal;
