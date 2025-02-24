import React, { useState, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';

const EditCompanyModal = ({ company, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    company_name: '',
    address: '',
    description: '',
    phone: '',
    abbrevation: '',
    registration_date: '',
    license_number: '',
    logo_image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (company) {
      setFormData({
        company_name: company.company_name || '',
        address: company.address || '',
        description: company.description || '',
        phone: company.phone || '',
        abbrevation: company.abbrevation || '',
        registration_date: company.registration_date || '',
        license_number: company.license_number || '',
        logo_image: null
      });
      setImagePreview(company.logo_image ? `http://82.29.160.146${company.logo_image}` : null);
    }
  }, [company]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'logo_image') {
      const file = files[0];
      setFormData(prev => ({ ...prev, logo_image: file }));
      setImagePreview(file ? URL.createObjectURL(file) : null);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      company_name: formData.company_name,
      address: formData.address,
      description: formData.description,
      phone: formData.phone,
      abbrevation: formData.abbrevation
    };
    onSave(payload);
  };

  if (!isOpen || !company) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-[600px] max-h-[85vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <IoMdClose size={24} />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Company Details</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
              <input
                type="text"
                name="license_number"
                value={formData.license_number}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Abbreviation</label>
            <input
              type="text"
              name="abbrevation"
              value={formData.abbrevation}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
            <div className="flex items-center space-x-4">
              {imagePreview && (
                <div className="w-20 h-20 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Company logo preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/default-logo.png';
                    }}
                  />
                </div>
              )}
              <div className="flex-1">
                <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg border border-gray-300 border-dashed cursor-pointer hover:bg-gray-50 transition-colors">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="mt-2 text-sm text-gray-500">Click to upload new logo</span>
                  <input
                    type="file"
                    name="logo_image"
                    onChange={handleChange}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="button"
              onClick={onClose}
              className="mr-4 px-6 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCompanyModal;