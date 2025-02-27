import React, { useState, useEffect } from "react";
import { X, User, Lock, Save } from 'lucide-react';
import SuperadminApi from '../../Services/SuperadminApi';

const EditStaffProfile = ({ staff, onClose }) => {
  const [activeTab, setActiveTab] = useState("editProfile");
  const [formData, setFormData] = useState({
    staffName: "",
    abbreviation: "",
    companyName: "",
    role: "",
    username: "",
    password: "",
    dateOfRegistration: "",
    phoneNumber: "",
    photo: null,
    photoPreview: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (staff) {
      setFormData({
        staffName: staff.staffName || "",
        abbreviation: staff.abbreviation || "",
        companyName: staff.companyName || "",
        role: staff.role || "",
        username: staff.username || "",
        password: staff.password || "",
        dateOfRegistration: staff.dateOfRegistration || "",
        phoneNumber: staff.phoneNumber || "",
        photoPreview: staff.photoPreview || "",
      });
    }
  }, [staff]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            photoPreview: reader.result,
          }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };
  const handleSave = async (e) => {
    e.preventDefault();
    
    try {
      // Create FormData object
      const formData = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key !== 'photo' && key !== 'photoPreview') {
          formData.append(key, formData[key]);
        }
      });

      // If there's a new photo, append it
      if (formData.photo) {
        formData.append('photo', formData.photo);
      }

      // Call the API to update staff
      await SuperadminApi.editStaff(staff.id, formData);
      
      // Close the modal and show success message
      onClose();
      // You might want to add a toast or notification here
      
    } catch (error) {
      console.error('Error updating staff:', error);
      setErrors({
        ...errors,
        submit: 'Failed to update staff. Please try again.'
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Edit Staff Profile
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex p-4 gap-2">
          <button
            onClick={() => setActiveTab("editProfile")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === "editProfile"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <User className="w-4 h-4" />
            Edit Profile
          </button>
          <button
            onClick={() => setActiveTab("changePassword")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === "changePassword"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Lock className="w-4 h-4" />
            Change Password
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === "editProfile" ? (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <img
                      src={formData.photoPreview || "/api/placeholder/150/150"}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-blue-700 transition-colors duration-200">
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleChange}
                        accept="image/*"
                      />
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </label>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Staff Name", name: "staffName" },
                    { label: "Abbreviation", name: "abbreviation" },
                    { label: "Company Name", name: "companyName" },
                    { label: "Role", name: "role" },
                    { label: "Username", name: "username" },
                    { label: "Phone Number", name: "phoneNumber" },
                    { label: "Date of Registration", name: "dateOfRegistration", type: "date" }
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                      </label>
                      <input
                        type={field.type || "text"}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                {["New Password", "Confirm Password"].map((label) => (
                  <div key={label}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label}
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditStaffProfile;

