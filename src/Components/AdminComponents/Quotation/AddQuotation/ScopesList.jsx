import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import axiosInstance from '../../../../Config/axiosInstance';
import ScopeModal from './ScopeModal';

const ScopesList = ({ optionName }) => {
  const [scopes, setScopes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isScopeModalOpen, setScopeModalOpen] = useState(false);
  const [editingScope, setEditingScope] = useState(null);

  // Get quotation ID from Redux store
  const quotationId = useSelector((state) => state.quotation.id);

  // Fetch scopes for the current quotation
  const fetchScopes = async () => {
    if (!quotationId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(
        `/list-scopeof-work/${quotationId}/`
      );
      console.log('Scopes response:', response.data);

      // Extract data from the response
      const scopesData = response.data.data || [];

      // Filter scopes by option name if provided
      const filteredScopes = optionName
        ? scopesData.filter((scope) => scope.options === optionName)
        : scopesData;

      setScopes(filteredScopes);
    } catch (err) {
      console.error('Error fetching scopes:', err);
      setError('Failed to load scope of work items');
    } finally {
      setLoading(false);
    }
  };

  // Load scopes when component mounts, quotationId changes, or option changes
  useEffect(() => {
    if (quotationId) {
      fetchScopes();
    }
  }, [quotationId, optionName]);

  // Handle adding a new scope
  const handleAddScope = (newScope) => {
    console.log('New scope added:', newScope);
    fetchScopes(); // Refresh the list to ensure we have the latest data
  };

  // Open modal for editing
  const handleEdit = (scope) => {
    setEditingScope(scope);
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

  if (loading && scopes.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">Loading scopes...</div>
    );
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="mt-6 bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b">
        <h3 className="text-lg font-semibold text-gray-700">Scope of Work</h3>
        <button
          onClick={() => {
            setEditingScope(null);
            setScopeModalOpen(true);
          }}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <FaPlus size={12} />
          <span>Add Scope</span>
        </button>
      </div>

      <div className="p-6">
        {scopes.length === 0 ? (
          <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
            No scope of work items added for {optionName || 'this option'}.
          </div>
        ) : (
          <div className="space-y-4">
            {scopes.map((scope, index) => (
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
                  dangerouslySetInnerHTML={{ __html: scope.scope_of_work }}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Scope Modal */}
      <ScopeModal
        isOpen={isScopeModalOpen}
        onClose={() => setScopeModalOpen(false)}
        onAdd={handleAddScope}
        initialData={editingScope}
        defaultOption={optionName}
      />
    </div>
  );
};

export default ScopesList;
