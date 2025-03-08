import React, { useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import { FcCancel } from "react-icons/fc";
import { IoArrowBack } from 'react-icons/io5';
import { AiOutlinePrinter, AiOutlineFilter } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DeleteConfirmationModal from '../../../components/Admin/Contract/DeleteConfirmationModal';
import DateFilterModal from './DateFilterModal';

const ClosedProjects = () => {
  const navigate = useNavigate();
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [dateFilters, setDateFilters] = useState({ dateFrom: '', dateTo: '' });

  const handleApplyDateFilters = (filters) => {
    setDateFilters(filters);
    setIsDateFilterOpen(false);
    // Implement your date filtering logic here
    console.log('Applied date filters:', filters);
  };

  const [quotations] = useState([
    {
      id: 1,
      date: '18-Nov-2024',
      quotationNo: 'zxcdsc-QTN-34-1124',
      client: 'Divya M',
      location: 'asdsda',
      status: 'Approved',
      amount: 0,
    },
    {
      id: 2,
      date: '18-Nov-2024',
      quotationNo: 'zxcdsc-QTN-35-1124',
      client: 'Divya M',
      location: 'asdsda',
      status: 'Approved',
      amount: 37478556,
    },
    {
      id: 3,
      date: '29-Oct-2024',
      quotationNo: 'zxcdsc-QTN-2-1024',
      client: 'Divya M',
      location: 'asdsda',
      status: 'Approved',
      amount: 14.7,
    },
  ]);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [quotationToDelete, setQuotationToDelete] = useState(null);

  const handleEdit = (quotation) => {
    navigate(`/edit-work-details/${quotation.id}`);
  };

  const handleDelete = (quotation) => {
    setQuotationToDelete(quotation);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    // Add your delete logic here
    console.log('Deleting quotation:', quotationToDelete);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="flex h-screen bg-gray-50">

      <div className="flex-1 md:w-[calc(100%-300px)] h-screen overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-8"
        >
          {/* Header section */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center space-x-8">
              <button
                onClick={() => navigate('/quotation-dashboard')}
                className="group flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
              >
                <IoArrowBack
                  size={20}
                  className="group-hover:-translate-x-1 transition-transform duration-300"
                />
                <span className="text-sm font-medium">Dashboard</span>
              </button>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight text-center">
            QUOTATIONS
          </h1>
          {/* Date Filter */}
          <div className="flex items-center justify-end space-x-4 mb-10">
            <button
              onClick={() => setIsDateFilterOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              <AiOutlineFilter size={20} />
              <span>{dateFilters.dateFrom && dateFilters.dateTo ? `${formatDate(dateFilters.dateFrom)} to ${formatDate(dateFilters.dateTo)}` : 'Select Date Range'}</span>
            </button>
          </div>

          {/* Table Container */}
          <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                      Date
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                      Quotation No
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                      Client
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                      Location
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                      Quotation Status
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                      Amount
                    </th>
                    <th className="px-8 py-5 text-center text-sm font-semibold text-gray-600 whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {quotations.map((quotation, index) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      key={quotation.id}
                      className="group hover:bg-blue-50/50 transition-colors duration-300"
                    >
                      <td className="px-8 py-5 text-gray-700 whitespace-nowrap">{formatDate(quotation.date)}</td>
                      <td className="px-8 py-5 text-gray-700 whitespace-nowrap">{quotation.quotationNo}</td>
                      <td className="px-8 py-5 text-gray-700 whitespace-nowrap">{quotation.client}</td>
                      <td className="px-8 py-5 text-gray-700 whitespace-nowrap">{quotation.location}</td>
                      <td className="px-8 py-5 text-gray-700 whitespace-nowrap">{quotation.status}</td>
                      <td className="px-8 py-5 text-gray-700 whitespace-nowrap">{quotation.amount}</td>
                      <td className="px-8 py-5 text-center whitespace-nowrap">
                        <div className="flex items-center space-x-4">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEdit(quotation)}
                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-300"
                          >
                            <FiEdit size={18} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(quotation)}
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-300"
                          >
                            <FcCancel size={18} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors duration-300"
                          >
                            <AiOutlinePrinter size={18} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* pagination */}
            <div className="px-8 py-5 border-t border-gray-200 bg-gray-50 flex items-center justify-end">
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300">
                  Previous
                </button>
                <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300">
                  Next
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <DateFilterModal
        isOpen={isDateFilterOpen}
        onClose={() => setIsDateFilterOpen(false)}
        onApply={handleApplyDateFilters}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setQuotationToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Quotation"
        message="Are you sure you want to delete this quotation? This action cannot be undone."
      />
    </div>
  );
};

export default ClosedProjects;