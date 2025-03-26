import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { MdCalendarMonth } from 'react-icons/md';

const DateFilterModal = ({
  isOpen,
  onClose,
  onApply,
  isLoading,
  initialDates,
}) => {
  const [dateFrom, setDateFrom] = useState(initialDates?.dateFrom || '');
  const [dateTo, setDateTo] = useState(initialDates?.dateTo || '');

  useEffect(() => {
    setDateFrom(initialDates?.dateFrom || '');
    setDateTo(initialDates?.dateTo || '');
  }, [initialDates, isOpen]);

  const handleApply = () => {
    onApply({ dateFrom, dateTo });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose} />

        <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <h2 className="text-lg font-medium mb-4 flex items-center gap-3">
            <span className="text-[2rem] text-blue-800">
              <MdCalendarMonth />
            </span>{' '}
            Select Date Range
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 border-[1px] border-[#dadada] rounded-md"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 border-[1px] border-[#dadada] rounded-md"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={isLoading || !dateFrom || !dateTo}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md flex items-center justify-center min-w-[100px] ${
                isLoading || !dateFrom || !dateTo
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Applying...</span>
                </>
              ) : (
                'Apply Filter'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateFilterModal;
