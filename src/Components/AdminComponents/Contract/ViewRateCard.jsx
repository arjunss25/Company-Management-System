import React, { useState, useEffect } from 'react';
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import UpdateRateCardModal from './UpdateRateCardModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { AdminApi } from '../../../Services/AdminApi';

const ViewRateCard = () => {
  const navigate = useNavigate();
  const [rateCards, setRateCards] = useState([]);
  const [selectedRateCard, setSelectedRateCard] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [rateCardToDelete, setRateCardToDelete] = useState(null);

  useEffect(() => {
    const fetchRateCards = async () => {
      try {
        const response = await AdminApi.listRateCards();
        setRateCards(response.data);
      } catch (error) {
        console.error('Error fetching rate cards:', error);
      }
    };

    fetchRateCards();
  }, []);

  const handleEdit = async (rateCard) => {
    setSelectedRateCard(rateCard);
    setIsUpdateModalOpen(true);
  };

  const handleDelete = (rateCard) => {
    setRateCardToDelete(rateCard);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await AdminApi.deleteRateCard(rateCardToDelete.id);
      setRateCards((prev) =>
        prev.filter((card) => card.id !== rateCardToDelete.id)
      );
      setIsDeleteModalOpen(false);
      setRateCardToDelete(null);
    } catch (error) {
      console.error('Error deleting rate card:', error);
    }
  };

  const handleUpdate = async () => {
    const response = await AdminApi.listRateCards();
    setRateCards(response.data);
  };

  return (
    <div className="flex">
      <div className="flex-1 ">
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
                onClick={() => navigate('/admin/contract-dashboard')}
                className="group flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
              >
                <IoArrowBack
                  size={20}
                  className="group-hover:-translate-x-1 transition-transform duration-300"
                />
                <span className="text-sm font-medium">Dashboard</span>
              </button>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                RATE CARD DETAILS
              </h1>
            </div>
          </div>

          {/* Table Container */}
          <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600">
                      Sl.No
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600">
                      Rate Card Name
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600">
                      Opex Or Capex
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600">
                      Client Name
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600">
                      Location Name
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rateCards.map((rateCard, index) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      key={rateCard.id}
                      className="group hover:bg-blue-50/50 transition-colors duration-300"
                    >
                      <td className="px-8 py-5">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-gray-700 font-medium">
                          {rateCard.card_name}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-gray-700 font-medium">
                          {rateCard.opex_capex}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-gray-700 font-medium">
                          {rateCard.client_name}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-gray-700 font-medium">
                          {rateCard.location_name}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center space-x-4">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEdit(rateCard)}
                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-300"
                          >
                            <FiEdit size={18} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(rateCard)}
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-300"
                          >
                            <RiDeleteBin6Line size={18} />
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

      <UpdateRateCardModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedRateCard(null);
        }}
        rateCard={selectedRateCard}
        onUpdate={handleUpdate}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setRateCardToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Rate Card"
        message="Are you sure you want to delete this rate card? This action cannot be undone."
      />
    </div>
  );
};

export default ViewRateCard;
