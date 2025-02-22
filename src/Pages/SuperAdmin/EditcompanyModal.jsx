import React, { useState, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
// import "./EditCompanyModal.css"

const EditCompanyModal = ({ company, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState(company ? { ...company } : {});
  const [logoName, setLogoName] = useState(company ? company.logo : '');

  useEffect(() => {
    if (company) {
      setFormData({ ...company });
      setLogoName(company.logo);
    }
  }, [company]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'logo') {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      setLogoName(files[0].name);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  if (!isOpen || !company) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[60%] h-[70vh] overflow-y-scroll relative hide-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          <IoMdClose size={24} />
        </button>
        <h2 className="text-xl font-semibold mb-4">Edit Company</h2>
        <form className="space-y-4">
          <div>
            <label className="block mb-2 text-gray-600 font-medium">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-600 font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-600 font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-600 font-medium">Logo</label>
            <input
              type="file"
              name="logo"
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg"
            />
            {logoName && <p className="mt-2 text-gray-600">{logoName}</p>}
          </div>
          <div>
            <label className="block mb-2 text-gray-600 font-medium">Date Of Registration</label>
            <input
              type="date"
              name="dateOfRegistration"
              value={formData.dateOfRegistration}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-600 font-medium">License Number</label>
            <input
              type="text"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleSave}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCompanyModal;