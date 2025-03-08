import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FilterSidebar = ({ isOpen, onClose, onApply }) => {
  const initialFilters = {
    quotationStatus: '',
    projectStatus: '',
    workStatus: '',
    client: '',
    wcr: '',
    location: '',
    lpo: '',
    grnStatus: '',
    invoiceStatus: '',
    salesPerson: '',
    siteInCharge: '',
  };

  const [filters, setFilters] = React.useState(initialFilters);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters(initialFilters);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-screen w-96 bg-white shadow-lg z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Filter Form */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Quotation Status</span>
                    <select
                      name="quotationStatus"
                      value={filters.quotationStatus}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">All</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Approval pending but work started on urgent basis</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Project Status</span>
                    <select
                      name="projectStatus"
                      value={filters.projectStatus}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">All</option>
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Work Status</span>
                    <select
                      name="workStatus"
                      value={filters.workStatus}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">All</option>
                      <option value="not-started">Not started</option>
                      <option value="in-progress">In Progress</option>
                      <option value="no-access">No Access</option>
                      <option value="on-hold">On Hold</option>
                      <option value="completed">Completed</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Client</span>
                    <select
                      name="client"
                      value={filters.client}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">All</option>
                      <option value="client1">client1</option>
                      <option value="client2">client2</option>
                      <option value="client3">client3</option>
                      <option value="client4">client4</option>
                      <option value="client5">client5</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">WCR Status</span>
                    <select
                      name="wcr"
                      value={filters.wcr}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select</option>
                      <option value="pending">Pending</option>
                      <option value="not-applicable">Not Applicable</option>
                      <option value="submitted">Submitted</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Location</span>
                    <select
                      name="location"
                      value={filters.location}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">All</option>
                      <option value="location1">location1</option>
                      <option value="location2">location2</option>
                      <option value="location3">location3</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">LPO Status</span>
                    <select
                      name="lpo"
                      value={filters.lpo}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select</option>
                      <option value="pending">Pending</option>
                      <option value="received">Received</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">GRN Status</span>
                    <select
                      name="grn"
                      value={filters.grn}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select</option>
                      <option value="pending">Pending</option>
                      <option value="received">Active</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Invoice Status</span>
                    <select
                      name="invoice"
                      value={filters.invoice}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select</option>
                      <option value="pending">Pending</option>
                      <option value="submitted">Submitted</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Sales Person</span>
                    <select
                      name="salesPerson"
                      value={filters.salesPerson}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select</option>
                      <option value="salesperson1">salesperson1</option>
                      <option value="salesperson2">salesperson2</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Site In Charge</span>
                    <select
                      name="siteInCharge"
                      value={filters.siteInCharge}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">All</option>
                      <option value="incharge1">incharge1</option>
                      <option value="incharge2">incharge2</option>
                    </select>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-6">
                  <button
                    onClick={handleReset}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Reset
                  </button>
                  <button
                    onClick={handleApply}
                    className="flex-1 px-4 py-2 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterSidebar;