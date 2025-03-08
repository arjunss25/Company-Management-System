import React, { useState } from 'react';
import { IoIosAdd } from 'react-icons/io';
import ProductModal from './ProductModal';
import ProductTable from './ProductTable';
import ScopeModal from './ScopeModal';

const ProductDetails = ({ optionValue }) => {
  const [selectedColumns, setSelectedColumns] = useState({
    Photo: false,
    Brand: false,
    Location: false,
    ItemCode: false,
    WorkOrderNumber: false,
    ReferenceNumber: false,
    Unit: true,
    Quantity: true,
    UnitPrice: true,
    Amount: true,
  });

  const [dropdownValues, setDropdownValues] = useState({
    subTotal: 'Not Applicable',
    vat: 'Not Applicable',
    discount: 'Not Applicable',
    scopeOfWork: 'Not Applicable',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productsByOption, setProductsByOption] = useState({});
  const [discountAmounts, setDiscountAmounts] = useState({});
  const [isScopeModalOpen, setIsScopeModalOpen] = useState(false);

  const handleColumnToggle = (columnName) => {
    setSelectedColumns((prev) => ({
      ...prev,
      [columnName]: !prev[columnName],
    }));
  };

  const handleDropdownChange = (field, value) => {
    setDropdownValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddProduct = (product) => {
    const selectedOption =
      optionValue === 'Not Applicable'
        ? 'Default Products'
        : product.selectedOption || 'Option 1';

    setProductsByOption((prev) => ({
      ...prev,
      [selectedOption]: prev[selectedOption]
        ? [
            // If option exists, add new product to first table's products
            [...prev[selectedOption][0], product],
            // Keep any other tables if they exist (though we won't create more now)
            ...prev[selectedOption].slice(1),
          ]
        : [[product]], // If option doesn't exist, create new table with product
    }));
    setIsModalOpen(false);
  };

  const handleEditProduct = (product) => {
    console.log('Edit product:', product);
  };

  const handleDeleteProduct = (optionName, productIndex) => {
    setProductsByOption((prev) => ({
      ...prev,
      [optionName]: [
        // Filter out the product from the first table
        prev[optionName][0].filter((_, i) => i !== productIndex),
        // Keep any other tables if they exist (though we won't create more now)
        ...prev[optionName].slice(1),
      ],
    }));

    // If the table becomes empty, remove the option
    if (productsByOption[optionName][0].length === 1) {
      const updatedProducts = { ...productsByOption };
      delete updatedProducts[optionName];
      setProductsByOption(updatedProducts);
    }
  };

  // Calculate base total for a single table
  const calculateTableTotal = (products) => {
    return products.reduce(
      (sum, product) => sum + Number(product.amount || 0),
      0
    );
  };

  // Calculate VAT amount (5% of amount after discount)
  const calculateVAT = (amount) => {
    return amount * 0.05;
  };

  // Calculate final total with discount and VAT
  const calculateFinalTotal = (baseTotal, option) => {
    // Get discount amount (if applicable)
    const discount =
      dropdownValues.discount === 'Applicable'
        ? Number(discountAmounts[option] || 0)
        : 0;

    // Apply discount
    const afterDiscount = baseTotal - discount;

    // Calculate and apply VAT if applicable
    const vat =
      dropdownValues.vat === 'Applicable' ? calculateVAT(afterDiscount) : 0;

    return {
      baseTotal,
      discount,
      afterDiscount,
      vat,
      finalTotal: afterDiscount + vat,
    };
  };

  // Handle discount input change
  const handleDiscountChange = (option, value) => {
    setDiscountAmounts((prev) => ({
      ...prev,
      [option]: value,
    }));
  };

  const handleAddScope = (scopeData) => {
    console.log('Scope data:', scopeData);
    // Add your scope handling logic here
    setIsScopeModalOpen(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6 space-y-4 sm:space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4 gap-4 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Product Details
        </h2>
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          <span>Upload Excel</span>
        </button>
      </div>

      {/* Column Selection */}
      <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
        <div className="flex items-center gap-3 mb-3 sm:mb-4">
          <span className="font-medium text-gray-700 text-sm sm:text-base">
            Visible Columns
          </span>
          <div className="h-px flex-1 bg-gray-200"></div>
        </div>
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
          {Object.entries(selectedColumns).map(([columnName, isChecked]) => (
            <label
              key={columnName}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-white transition-all cursor-pointer"
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleColumnToggle(columnName)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700 leading-none">
                {columnName.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Dropdowns Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {Object.entries(dropdownValues).map(([field, value]) => (
          <div key={field} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <select
              value={value}
              onChange={(e) => handleDropdownChange(field, e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-400"
            >
              <option value="Not Applicable">Not Applicable</option>
              <option value="Applicable">Applicable</option>
            </select>
          </div>
        ))}
      </div>

      {/* Add Line Item and Add Scope Buttons */}
      <div className="flex justify-center sm:justify-end gap-3">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          <IoIosAdd className="text-[1.5rem] sm:text-[2rem]" />
          Add Line Item
        </button>

        {dropdownValues.scopeOfWork === 'Applicable' && (
          <button
            onClick={() => setIsScopeModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            <IoIosAdd className="text-[1.5rem] sm:text-[2rem]" />
            Add Scope
          </button>
        )}
      </div>

      {/* Product Tables */}
      {Object.entries(productsByOption).map(
        ([option, tables]) =>
          tables.length > 0 &&
          tables[0].length > 0 && (
            <div key={option} className="mt-6">
              {/* Option Title */}
              <div className="mb-4 border-b pb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {option}
                </h3>
              </div>

              {/* Single table per option */}
              <div className="mb-6">
                <ProductTable
                  products={tables[0]}
                  selectedColumns={selectedColumns}
                  onEdit={handleEditProduct}
                  onDelete={(index) => handleDeleteProduct(option, index)}
                />

                {/* Table Totals */}
                <div className="flex flex-col gap-2 items-end mt-4 mb-6">
                  {(() => {
                    const baseTotal = calculateTableTotal(tables[0]);
                    const totals = calculateFinalTotal(baseTotal, option);

                    return (
                      <>
                        {dropdownValues.subTotal === 'Applicable' && (
                          <div className="bg-gray-50 px-4 py-2 rounded-lg">
                            <span className="text-sm font-medium text-gray-600">
                              Sub Total:
                            </span>
                            <span className="ml-2 text-sm font-semibold text-gray-900">
                              ${baseTotal.toFixed(2)}
                            </span>
                          </div>
                        )}

                        <div className="bg-gray-50 px-4 py-2 rounded-lg">
                          <span className="text-sm font-medium text-gray-600">
                            Total Amount:
                          </span>
                          <span className="ml-2 text-sm font-semibold text-gray-900">
                            ${baseTotal.toFixed(2)}
                          </span>
                        </div>

                        {/* Discount input when applicable */}
                        {dropdownValues.discount === 'Applicable' && (
                          <div className="bg-gray-50 px-4 py-2 rounded-lg flex items-center">
                            <span className="text-sm font-medium text-gray-600 mr-2">
                              Discount:
                            </span>
                            <div className="flex items-center">
                              <span className="text-gray-600 mr-1">$</span>
                              <input
                                type="number"
                                value={discountAmounts[option] || ''}
                                onChange={(e) =>
                                  handleDiscountChange(option, e.target.value)
                                }
                                className="w-24 p-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                              />
                            </div>
                          </div>
                        )}

                        {dropdownValues.discount === 'Applicable' && (
                          <div className="bg-gray-50 px-4 py-2 rounded-lg">
                            <span className="text-sm font-medium text-gray-600">
                              After Discount:
                            </span>
                            <span className="ml-2 text-sm font-semibold text-gray-900">
                              ${totals.afterDiscount.toFixed(2)}
                            </span>
                          </div>
                        )}

                        {/* VAT when applicable */}
                        {dropdownValues.vat === 'Applicable' && (
                          <div className="bg-gray-50 px-4 py-2 rounded-lg">
                            <span className="text-sm font-medium text-gray-600">
                              VAT (5%):
                            </span>
                            <span className="ml-2 text-sm font-semibold text-gray-900">
                              ${totals.vat.toFixed(2)}
                            </span>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>

                {/* Option Grand Total */}
                <div className="flex justify-end mt-6 mb-8 border-t pt-4">
                  <div className="bg-blue-50 px-6 py-3 rounded-lg">
                    <span className="text-base font-medium text-blue-700">
                      {option} Grand Total:
                    </span>
                    <span className="ml-3 text-lg font-semibold text-blue-900">
                      $
                      {calculateFinalTotal(
                        calculateTableTotal(tables[0]),
                        option
                      ).finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
      )}

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedColumns={selectedColumns}
        onAdd={handleAddProduct}
        showOptions={optionValue === 'Applicable'}
      />

      <ScopeModal
        isOpen={isScopeModalOpen}
        onClose={() => setIsScopeModalOpen(false)}
        onAdd={handleAddScope}
      />
    </div>
  );
};

export default ProductDetails;
