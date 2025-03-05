// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import axiosInstance from '../../../Config/axiosInstance';
// import { toast } from 'react-hot-toast';

// const AddContractModal = ({ isOpen, onClose }) => {
//   const [formData, setFormData] = useState({
//     client: '',
//     location: '',
//     rateCard: '',
//     contractNo: '',
//     validFrom: '',
//     validTill: '',
//     attachment: null,
//   });
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [clients, setClients] = useState([]);
//   const [locations, setLocations] = useState([]);
//   const [rateCards, setRateCards] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch clients
//         const clientsResponse = await axiosInstance.get('/clientGet/');
//         setClients(clientsResponse.data.data || []);

//         // Fetch locations
//         const locationsResponse = await axiosInstance.get('/list-locations/');
//         setLocations(locationsResponse.data.data || []);

//         // Fetch rate cards
//         const rateCardsResponse = await axiosInstance.get('/list-rate-cards/');
//         setRateCards(rateCardsResponse.data.data || []);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         toast.error('Failed to load form data');
//       }
//     };

//     if (isOpen) {
//       fetchData();
//     }
//   }, [isOpen]);

//   const handleInputChange = (e) => {
//     const { name, value, type, files } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'file' ? files[0] : value,
//     }));
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: '' }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     const requiredFields = [
//       'client',
//       'location',
//       'rateCard',
//       'contractNo',
//       'validFrom',
//       'validTill',
//     ];

//     requiredFields.forEach((field) => {
//       if (!formData[field]) {
//         newErrors[field] = `${
//           field.charAt(0).toUpperCase() +
//           field.slice(1).replace(/([A-Z])/g, ' $1')
//         } is required`;
//       }
//     });

//     // Validate dates
//     if (formData.validFrom && formData.validTill) {
//       const fromDate = new Date(formData.validFrom);
//       const tillDate = new Date(formData.validTill);
//       if (fromDate > tillDate) {
//         newErrors.validTill = 'Valid till date must be after valid from date';
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setLoading(true);
//     try {
//       const formDataToSend = new FormData();
//       Object.keys(formData).forEach((key) => {
//         if (key === 'attachment' && formData[key]) {
//           formDataToSend.append('attachment', formData[key]);
//         } else {
//           formDataToSend.append(key, formData[key]);
//         }
//       });

//       const response = await axiosInstance.post(
//         '/add-contract/',
//         formDataToSend,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       if (response.data.status === 'Success') {
//         toast.success('Contract added successfully');
//         setFormData({
//           client: '',
//           location: '',
//           rateCard: '',
//           contractNo: '',
//           validFrom: '',
//           validTill: '',
//           attachment: null,
//         });
//         onClose();
//       } else {
//         toast.error(response.data.message || 'Failed to add contract');
//       }
//     } catch (error) {
//       console.error('Error adding contract:', error);
//       toast.error(error.response?.data?.message || 'Failed to add contract');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <AnimatePresence>
//       <div className="fixed inset-0 z-50 flex items-center justify-center">
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 bg-black bg-opacity-50"
//           onClick={onClose}
//         />

//         <motion.div
//           initial={{ scale: 0.95, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           exit={{ scale: 0.95, opacity: 0 }}
//           className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl relative z-50 max-h-[90vh] overflow-y-auto"
//         >
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold text-gray-900">Add Contract</h2>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-600 transition-colors"
//             >
//               <svg
//                 className="w-6 h-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-700">
//                   Client
//                 </label>
//                 <select
//                   name="client"
//                   value={formData.client}
//                   onChange={handleInputChange}
//                   className={`w-full p-3 border ${
//                     errors.client ? 'border-red-500' : 'border-gray-200'
//                   } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
//                 >
//                   <option value="">Select client</option>
//                   {clients.map((client) => (
//                     <option key={client.id} value={client.id}>
//                       {client.clientName}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.client && (
//                   <p className="text-red-500 text-xs mt-1">{errors.client}</p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-700">
//                   Location
//                 </label>
//                 <select
//                   name="location"
//                   value={formData.location}
//                   onChange={handleInputChange}
//                   className={`w-full p-3 border ${
//                     errors.location ? 'border-red-500' : 'border-gray-200'
//                   } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
//                 >
//                   <option value="">Select location</option>
//                   {locations.map((location) => (
//                     <option key={location.id} value={location.id}>
//                       {location.location_name}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.location && (
//                   <p className="text-red-500 text-xs mt-1">{errors.location}</p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-700">
//                   Rate Card
//                 </label>
//                 <select
//                   name="rateCard"
//                   value={formData.rateCard}
//                   onChange={handleInputChange}
//                   className={`w-full p-3 border ${
//                     errors.rateCard ? 'border-red-500' : 'border-gray-200'
//                   } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
//                 >
//                   <option value="">Select rate card</option>
//                   {rateCards.map((card) => (
//                     <option key={card.id} value={card.id}>
//                       {card.name}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.rateCard && (
//                   <p className="text-red-500 text-xs mt-1">{errors.rateCard}</p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-700">
//                   Contract No
//                 </label>
//                 <input
//                   type="text"
//                   name="contractNo"
//                   value={formData.contractNo}
//                   onChange={handleInputChange}
//                   placeholder="Enter contract number"
//                   className={`w-full p-3 border ${
//                     errors.contractNo ? 'border-red-500' : 'border-gray-200'
//                   } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
//                 />
//                 {errors.contractNo && (
//                   <p className="text-red-500 text-xs mt-1">
//                     {errors.contractNo}
//                   </p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-700">
//                   Valid From
//                 </label>
//                 <input
//                   type="date"
//                   name="validFrom"
//                   value={formData.validFrom}
//                   onChange={handleInputChange}
//                   className={`w-full p-3 border ${
//                     errors.validFrom ? 'border-red-500' : 'border-gray-200'
//                   } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
//                 />
//                 {errors.validFrom && (
//                   <p className="text-red-500 text-xs mt-1">
//                     {errors.validFrom}
//                   </p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-700">
//                   Valid Till
//                 </label>
//                 <input
//                   type="date"
//                   name="validTill"
//                   value={formData.validTill}
//                   onChange={handleInputChange}
//                   className={`w-full p-3 border ${
//                     errors.validTill ? 'border-red-500' : 'border-gray-200'
//                   } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
//                 />
//                 {errors.validTill && (
//                   <p className="text-red-500 text-xs mt-1">
//                     {errors.validTill}
//                   </p>
//                 )}
//               </div>

//               <div className="space-y-2 md:col-span-2">
//                 <label className="text-sm font-medium text-gray-700">
//                   Attachment
//                 </label>
//                 <input
//                   type="file"
//                   name="attachment"
//                   onChange={handleInputChange}
//                   className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
//                 />
//               </div>
//             </div>

//             <div className="flex justify-end space-x-4 pt-4">
//               <button
//                 type="button"
//                 onClick={() => {
//                   setFormData({
//                     client: '',
//                     location: '',
//                     rateCard: '',
//                     contractNo: '',
//                     validFrom: '',
//                     validTill: '',
//                     attachment: null,
//                   });
//                   setErrors({});
//                 }}
//                 className="px-6 py-2.5 rounded-lg border border-red-500 text-red-500 hover:bg-red-50 transition-colors duration-300"
//               >
//                 Reset
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="px-6 py-2.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loading ? 'Submitting...' : 'Submit'}
//               </button>
//             </div>
//           </form>
//         </motion.div>
//       </div>
//     </AnimatePresence>
//   );
// };

// export default AddContractModal;
