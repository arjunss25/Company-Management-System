import React from 'react';
import { useNavigate } from 'react-router-dom';

import { motion } from 'framer-motion';
 

const StaffList = ({ onEditClick, onDelete }) => {
  const staffList = [
    {
      id: 1,
      staffName: 'AA New company',
      role: 'Admin',
      dateOfRegistration: '02-11-2024',
    },
    {
      id: 2,
      staffName: 'Aaa new staff',
      role: 'Staff',
      dateOfRegistration: '05-11-2024',
    },
    {
      id: 3,
      staffName: 'AAA new staff',
      role: 'Staff',
      dateOfRegistration: '05-11-2024',
    },
    {
      id: 4,
      staffName: 'AAAA Staff',
      role: 'Staff',
      dateOfRegistration: '08-11-2024',
    },
    {
      id: 5,
      staffName: 'Aaaaa Admin',
      role: 'Admin',
      dateOfRegistration: '29-11-2024',
    },
  ];

  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          Staff List
        </h2>
      </div>

      {/* Table Container */}
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600">
                  Sl No.
                </th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600">
                  Staff Name
                </th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600">
                  Role
                </th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600">
                  Date Of Registration
                </th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((staff, index) => (
                <motion.tr
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  key={staff.id}
                  className="group hover:bg-blue-50/50 transition-colors duration-300"
                >
                  <td className="px-8 py-5">
                    <span className="text-gray-700">{index + 1}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-300">
                      {staff.staffName}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span
                      className={`inline-flex items-center justify-center w-24 px-3 py-1 rounded-full text-sm font-medium ${
                        staff.role === 'Admin'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {staff.role}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-gray-700">
                      {staff.dateOfRegistration}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('')}
                        className="px-4 py-2 text-yellow-500 border border-yellow-500 rounded-lg hover:bg-yellow-50 transition-colors duration-300"
                      >
                        User Rights
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onEditClick(staff)}
                        className="px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-50 transition-colors duration-300"
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onDelete(staff.id)}
                        className="px-4 py-2 text-red-500 border border-red-500 rounded-lg hover:bg-red-50 transition-colors duration-300"
                      >
                        Delete
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
  );
};

export default StaffList;
