import React, { useState } from 'react';
import { X } from 'lucide-react';

const EditModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    heading: 'Painting',
    description: '',
    unit: 'Kilo gram',
    quantity: 12,
    unitPrice: 2,
    amount: 24.00
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  const calculateAmount = () => {
    const amount = (formData.quantity || 0) * (formData.unitPrice || 0);
    setFormData(prev => ({ ...prev, amount }));
  };

  const handleFormat = (command) => {
    document.execCommand(command, false, null);  // Apply the format
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-20 backdrop-blur-sm z-40 flex items-center justify-center">
      {/* Modal */}
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl z-50 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Edit Product</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heading:</label>
              <select 
                value={formData.heading}
                onChange={(e) => setFormData(prev => ({ ...prev, heading: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Painting">Painting</option>
                <option value="Drawing">Drawing</option>
                <option value="Sculpture">Sculpture</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description:</label>
              <div className="border border-gray-300 rounded-md">
                <div className="flex gap-2 mb-2 border-b p-2">
                  <select className="text-sm border rounded px-2 py-1">
                    <option>Normal</option>
                    <option>Heading 1</option>
                    <option>Heading 2</option>
                  </select>
                  <div className="flex gap-2">
                    <button type="button" className="px-2 hover:bg-gray-100 rounded font-medium" onClick={() => handleFormat('bold')}>B</button>
                    <button type="button" className="px-2 hover:bg-gray-100 rounded italic" onClick={() => handleFormat('italic')}>I</button>
                    <button type="button" className="px-2 hover:bg-gray-100 rounded underline" onClick={() => handleFormat('underline')}>U</button>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" className="px-2 hover:bg-gray-100 rounded" onClick={() => handleFormat('insertUnorderedList')}>•</button>
                    <button type="button" className="px-2 hover:bg-gray-100 rounded" onClick={() => handleFormat('insertOrderedList')}>1.</button>
                  </div>
                </div>

                {/* Use a div with contentEditable for rich text */}
                <div 
                  className="w-full min-h-[100px] p-2 resize-none focus:outline-none border-t"
                  contentEditable 
                  dangerouslySetInnerHTML={{ __html: formData.description }} 
                  onInput={(e) => setFormData(prev => ({ ...prev, description: e.target.innerHTML }))}
                  placeholder="Enter description..."
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit:</label>
              <select 
                value={formData.unit}
                onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Kilo gram">Kilo gram</option>
                <option value="Piece">Piece</option>
                <option value="Meter">Meter</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity:</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, quantity: parseFloat(e.target.value) }));
                  calculateAmount();
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit price:</label>
              <input
                type="number"
                value={formData.unitPrice}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) }));
                  calculateAmount();
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount:</label>
              <input
                type="number"
                value={formData.amount}
                disabled
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button 
              type="submit" 
              className="bg-cyan-400 hover:bg-cyan-500 text-white px-4 py-2 rounded-md transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
