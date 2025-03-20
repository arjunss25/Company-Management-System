import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import axiosInstance from '../../../../Config/axiosInstance';
import ScopeModal from './ScopeModal';

const ScopesSection = () => {
  const [scopes, setScopes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isScopeModalOpen, setScopeModalOpen] = useState(false);
  const [editingScope, setEditingScope] = useState(null);
  const [selectedOption, setSelectedOption] = useState('Option 1');

  // Get quotation ID from Redux store
  const quotationId = useSelector((state) => state.quotation.id);

  // Available options - always show these regardless of product data
  const optionsList = ['Option 1', 'Option 2', 'Option 3'];

  // Fetch scopes for the current quotation
  const fetchScopes = async () => {
    if (!quotationId) {
      console.log('No quotation ID available yet');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`Fetching scopes for quotation ID: ${quotationId}`);
      const response = await axiosInstance.get(
        `/list-scopeof-work/${quotationId}/`
      );
      console.log('Scopes response:', response.data);

      // Extract data from the response
      const scopesData = response.data.data || [];
      setScopes(scopesData);
    } catch (err) {
      console.error('Error fetching scopes:', err);
      setError('Failed to load scope of work items');
    } finally {
      setLoading(false);
    }
  };

  // Load scopes when component mounts or quotationId changes
  useEffect(() => {
    console.log('ScopesSection useEffect - quotationId:', quotationId);
    if (quotationId) {
      fetchScopes();
    }
  }, [quotationId]);

  // Handle adding a new scope
  const handleAddScope = (newScope) => {
    console.log('New scope added:', newScope);
    fetchScopes(); // Refresh the list to ensure we have the latest data
  };

  // Open modal for editing
  const handleEdit = (scope) => {
    setEditingScope(scope);
    setSelectedOption(scope.options);
    setScopeModalOpen(true);
  };

  // Handle deleting a scope
  const handleDelete = async (scopeId) => {
    if (!confirm('Are you sure you want to delete this scope of work?')) return;

    try {
      // Note: Implement or replace with your actual delete endpoint
      await axiosInstance.delete(`/delete-scopeof-work/${scopeId}/`);
      setScopes((prevScopes) =>
        prevScopes.filter((scope) => scope.id !== scopeId)
      );
    } catch (err) {
      console.error('Error deleting scope:', err);
      alert('Failed to delete scope of work');
    }
  };

  // Group scopes by option
  const getScopesByOption = (optionName) => {
    return scopes.filter((scope) => scope.options === optionName);
  };

  // Open modal with pre-selected option
  const handleAddForOption = (option) => {
    setSelectedOption(option);
    setEditingScope(null);
    setScopeModalOpen(true);
  };

  // If no quotation ID, show a message
  if (!quotationId) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center text-yellow-700">
        Please complete the work details first to get a quotation ID.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Scope of Work</h2>
        <p className="text-sm text-gray-500">Quotation ID: {quotationId}</p>
      </div>

      {loading && scopes.length === 0 ? (
        <div className="text-center py-6 text-gray-500">Loading scopes...</div>
      ) : error ? (
        <div className="text-center py-6 text-red-500">{error}</div>
      ) : (
        <div className="space-y-8">
          {optionsList.map((option) => {
            const optionScopes = getScopesByOption(option);

            return (
              <div
                key={option}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                  <h3 className="font-semibold text-gray-700">{option}</h3>
                  <button
                    onClick={() => handleAddForOption(option)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <FaPlus size={12} />
                    <span>Add Scope</span>
                  </button>
                </div>

                <div className="p-6">
                  {optionScopes.length === 0 ? (
                    <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
                      No scope of work items added for {option}.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {optionScopes.map((scope, index) => (
                        <motion.div
                          key={scope.id || index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium text-gray-800">
                              Scope {index + 1}
                            </h4>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(scope)}
                                className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                title="Edit scope"
                              >
                                <FaEdit size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(scope.id)}
                                className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                                title="Delete scope"
                              >
                                <FaTrash size={16} />
                              </button>
                            </div>
                          </div>
                          <div
                            className="prose prose-sm max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{
                              __html: scope.scope_of_work,
                            }}
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Scope Modal */}
      <ScopeModal
        isOpen={isScopeModalOpen}
        onClose={() => setScopeModalOpen(false)}
        onAdd={handleAddScope}
        initialData={editingScope}
        defaultOption={selectedOption}
      />
    </div>
  );
};

export default ScopesSection;
