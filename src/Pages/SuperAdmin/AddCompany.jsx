import React, { useState } from 'react';

const AddCompany = () => {
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState(null);
  const [dateOfRegistration, setDateOfRegistration] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [abbreviation, setAbbreviation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', {
      companyName,
      address,
      description,
      logo,
      dateOfRegistration,
      licenseNumber,
      phoneNumber,
      abbreviation,
    });
    // Reset form
    setCompanyName('');
    setAddress('');
    setDescription('');
    setLogo(null);
    setDateOfRegistration('');
    setLicenseNumber('');
    setPhoneNumber('');
    setAbbreviation('');
  };

  const handleReset = () => {
    setCompanyName('');
    setAddress('');
    setDescription('');
    setLogo(null);
    setDateOfRegistration('');
    setLicenseNumber('');
    setPhoneNumber('');
    setAbbreviation('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block mb-2 text-gray-600 font-medium">Company Name</label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Enter Company Name"
          className="w-full p-3 border border-gray-200 rounded-lg"
        />
      </div>
      <div>
        <label className="block mb-2 text-gray-600 font-medium">Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter Address"
          className="w-full p-3 border border-gray-200 rounded-lg"
        />
      </div>
      <div>
        <label className="block mb-2 text-gray-600 font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter Description"
          rows="3"
          className="w-full p-3 border border-gray-200 rounded-lg"
        />
      </div>
      <div>
        <label className="block mb-2 text-gray-600 font-medium">Logo</label>
        <input
          type="file"
          onChange={(e) => setLogo(e.target.files[0])}
          className="w-full p-3 border border-gray-200 rounded-lg"
        />
      </div>
      <div>
        <label className="block mb-2 text-gray-600 font-medium">Date Of Registration</label>
        <input
          type="date"
          value={dateOfRegistration}
          onChange={(e) => setDateOfRegistration(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg"
        />
      </div>
      <div>
        <label className="block mb-2 text-gray-600 font-medium">License Number</label>
        <input
          type="text"
          value={licenseNumber}
          onChange={(e) => setLicenseNumber(e.target.value)}
          placeholder="Enter License Number"
          className="w-full p-3 border border-gray-200 rounded-lg"
        />
      </div>
      <div>
        <label className="block mb-2 text-gray-600 font-medium">Phone Number</label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter Phone Number"
          className="w-full p-3 border border-gray-200 rounded-lg"
        />
      </div>
      <div>
        <label className="block mb-2 text-gray-600 font-medium">Abbreviation</label>
        <input
          type="text"
          value={abbreviation}
          onChange={(e) => setAbbreviation(e.target.value)}
          placeholder="Enter Abbreviation"
          className="w-full p-3 border border-gray-200 rounded-lg"
        />
      </div>
      <div className="flex space-x-4">
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default AddCompany;