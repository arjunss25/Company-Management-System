import React, { useState, useEffect } from "react";

const EditStaffModal = ({ isOpen, staffData, handleClose, handleUpdate }) => {
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
        if (staffData) {
            setFormData({
                staffName: staffData.staffName || "",
                abbreviation: staffData.abbreviation || "",
                companyName: staffData.companyName || "",
                role: staffData.role || "",
                username: staffData.username || "",
                password: staffData.password || "",
                dateOfRegistration: staffData.dateOfRegistration || "",
                phoneNumber: staffData.phoneNumber || "",
                photoPreview: staffData.photoPreview || "",
            });
        }
    }, [staffData]);  // Depend on staffData to update form data
    

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (files) {
            const file = files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFormData((prevData) => ({
                        ...prevData,
                        photoPreview: reader.result,
                    }));
                };
                reader.readAsDataURL(file);
            }
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
            setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.staffName.trim()) newErrors.staffName = "Staff Name is required.";
        if (!formData.companyName.trim()) newErrors.companyName = "Company Name is required.";
        if (!formData.role.trim()) newErrors.role = "Role is required.";
        if (!formData.username.trim()) newErrors.username = "Username is required.";
        if (!formData.password.trim()) newErrors.password = "Password is required.";
        if (!formData.dateOfRegistration.trim()) newErrors.dateOfRegistration = "Date of Registration is required.";
        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone Number is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            handleUpdate(formData);
            handleClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 overflow-y-scroll">
            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-3xl h-[80vh] overflow-y-scroll">
                <h2 className="text-lg font-bold text-blue-700 mb-4">Edit Staff</h2>
                <form onSubmit={handleSubmit}>
                    {[
                        { label: "Staff Name", name: "staffName", type: "text" },
                        { label: "Abbreviation", name: "abbreviation", type: "text" },
                        { label: "Company Name", name: "companyName", type: "text" },
                        { label: "Role", name: "role", type: "text" },
                        { label: "Username", name: "username", type: "text" },
                        { label: "Password", name: "password", type: "password" },
                        { label: "Date of Registration", name: "dateOfRegistration", type: "date" },
                        { label: "Phone Number", name: "phoneNumber", type: "tel" },
                    ].map((field) => (
                        <div key={field.name} className="mb-2">
                            <label className="block text-gray-700 mb-1">
                                {field.label}:
                            </label>
                            {field.type === "textarea" ? (
                                <textarea
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    className="w-full border rounded-md p-2 focus:ring focus:ring-blue-200 text-black"
                                />
                            ) : (
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    className="w-full border rounded-md p-2 focus:ring focus:ring-blue-200 text-black"
                                />
                            )}
                            {errors[field.name] && (
                                <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
                            )}
                        </div>
                    ))}
                    <div className="mb-2">
                        <label className="block text-gray-700 mb-1">Photo:</label>
                        <input
                            type="file"
                            name="photo"
                            onChange={handleChange}
                            className="w-full border rounded-md p-2 focus:ring focus:ring-blue-200 bg-white text-gray-700 text-black"
                        />
                        {formData.photoPreview && (
                            <img
                                src={formData.photoPreview}
                                alt="Photo Preview"
                                className="mt-2 w-20 h-20 object-cover border"
                            />
                        )}
                    </div>
                    <div className="flex space-x-4 mt-2">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Update
                        </button>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                        >
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditStaffModal;
