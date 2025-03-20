import React, { useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuotationProducts } from '../../../../store/slices/quotationProductsSlice';
import ScopesList from './ScopesList';

const ProductTable = ({
  selectedColumns,
  onEdit,
  onDelete,
  products,
  optionName,
}) => {
  const quotationId = useSelector((state) => state.quotation.id);

  const getVisibleColumns = () => {
    const defaultColumns = {
      'Sl. No': true,
      Heading: true,
      Description: true,
      ...selectedColumns,
      Action: true,
    };

    return Object.entries(defaultColumns)
      .filter(([_, isVisible]) => isVisible)
      .map(([columnName]) => columnName);
  };

  const visibleColumns = getVisibleColumns();

  const renderProductRow = (product, index) => (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      key={product.id || index}
      className="group hover:bg-blue-50/50 transition-colors duration-300"
    >
      {visibleColumns.map((column) => (
        <td key={column} className="px-8 py-5">
          {column === 'Sl. No' ? (
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium">
              {index + 1}
            </span>
          ) : column === 'Action' ? (
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onEdit(product)}
                className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-300"
              >
                <FaEdit size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDelete(index)}
                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-300"
              >
                <FaTrash size={18} />
              </motion.button>
            </div>
          ) : (
            <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-300">
              {getProductValue(product, column)}
            </span>
          )}
        </td>
      ))}
    </motion.tr>
  );

  const getProductValue = (product, column) => {
    const columnMapping = {
      Heading: 'heading',
      Description: 'description',
      Unit: 'unit',
      Quantity: 'quantity',
      UnitPrice: 'unit_price',
      Amount: 'amount',
      Brand: 'brand',
      Location: 'location',
      ItemCode: 'item_code',
      WorkOrderNumber: 'work_order_number',
      ReferenceNumber: 'reference_number',
      Photo: 'photo',
    };

    const key = columnMapping[column];
    if (!key) return '';

    if (key === 'photo' && product[key]) {
      return (
        <img
          src={product[key]}
          alt="Product"
          className="w-10 h-10 object-cover rounded"
        />
      );
    }

    return product[key];
  };

  return (
    <div className="space-y-6">
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
        <div className="bg-gray-50 px-8 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">{optionName}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                {visibleColumns.map((column) => (
                  <th
                    key={column}
                    className="px-8 py-5 text-left text-sm font-semibold text-gray-600"
                  >
                    {column === 'Sl. No' ? 'ID' : column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) =>
                renderProductRow(product, index)
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* {quotationId && <ScopesList optionName={optionName} />} */}
    </div>
  );
};

export default ProductTable;
