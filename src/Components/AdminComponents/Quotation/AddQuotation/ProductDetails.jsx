import React, { useState, useEffect, useCallback } from 'react';
import { IoIosAdd } from 'react-icons/io';
import { FaEdit, FaTrash } from 'react-icons/fa';
import ProductModal from './ProductModal';
import ProductTable from './ProductTable';
import ScopeModal from './ScopeModal';
import { useDispatch, useSelector } from 'react-redux';
import { addQuotationProduct } from '../../../../store/slices/quotationProductsSlice';
import axiosInstance from '../../../../Config/axiosInstance';
import {
  calculateSubTotal,
  calculateVAT,
  calculateDiscount,
} from '../../../../Services/QuotationApi';
import debounce from 'lodash/debounce';

const ProductDetails = ({ optionValue, onProductsAdded = () => {} }) => {
  const dispatch = useDispatch();
  const quotationId = useSelector((state) => state.quotation.id);

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

  // Scope related states
  const [scopes, setScopes] = useState([]);
  const [loadingScopes, setLoadingScopes] = useState(false);
  const [scopeError, setScopeError] = useState(null);
  const [selectedOption, setSelectedOption] = useState('Option 1');
  const [editingScope, setEditingScope] = useState(null);

  // Confirmation modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [scopeToDelete, setScopeToDelete] = useState(null);

  // Result modal states
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [resultSuccess, setResultSuccess] = useState(true);

  // Add new state to store product IDs
  const [productIds, setProductIds] = useState({});

  // Column toggle handler
  const handleColumnToggle = (columnName) => {
    setSelectedColumns((prev) => ({
      ...prev,
      [columnName]: !prev[columnName],
    }));
  };

  // Dropdown change handler
  const handleDropdownChange = async (field, value) => {
    console.log(`Dropdown changed: ${field} = ${value}`);
    console.log('Current productsByOption:', productsByOption);

    setDropdownValues((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Trigger relevant calculation when dropdown changes to Applicable
    if (value === 'Applicable') {
      Object.entries(productsByOption).forEach(async ([option, products]) => {
        console.log(`Processing option: ${option}`, products);

        // Check if products is an array and has items
        if (!Array.isArray(products) || products.length === 0) {
          console.log('No products found for option:', option);
          return;
        }

        const productId = products[0]?.id;
        console.log('Product ID found:', productId);

        if (!productId) {
          console.log('No product ID available for:', option);
          return;
        }

        try {
          switch (field) {
            case 'subTotal':
              const subTotalResponse = await calculateSubTotal({
                product_id: productId.toString(),
                sub_total: 'Applicable',
              });
              console.log('SubTotal API Response:', subTotalResponse);
              if (subTotalResponse?.data) {
                setCalculations((prev) => ({
                  ...prev,
                  [option]: {
                    ...prev[option],
                    subTotal: subTotalResponse.data,
                  },
                }));
              }
              break;

            case 'vat':
              console.log('Entering VAT case with:', {
                option,
                productId,
                dropdownValue: value,
              });

              if (!productId) {
                console.error('No product ID available for VAT calculation');
                return;
              }

              try {
                const vatPayload = {
                  product_id: productId.toString(),
                  vat: 'Applicable',
                };

                console.log('Sending VAT calculation request:', vatPayload);

                const vatResponse = await calculateVAT(vatPayload);
                console.log('Raw VAT Response:', vatResponse);

                if (vatResponse?.data?.status === 'Success') {
                  const responseData = vatResponse.data.data;
                  console.log('VAT Response data:', responseData);

                  if (
                    responseData &&
                    responseData.vat_amount &&
                    responseData.grand_total
                  ) {
                    setCalculations((prev) => ({
                      ...prev,
                      [option]: {
                        ...prev[option],
                        vat: {
                          vat_amount: responseData.vat_amount,
                          grand_total: responseData.grand_total,
                        },
                      },
                    }));
                    console.log(
                      'Successfully updated calculations with VAT data'
                    );
                  } else {
                    console.error(
                      'Invalid data structure in VAT response:',
                      responseData
                    );
                  }
                } else {
                  console.error('Invalid VAT response:', vatResponse);
                }
              } catch (error) {
                console.error('Error in VAT calculation:', error);
                console.error('Error details:', {
                  message: error.message,
                  stack: error.stack,
                  response: error.response,
                });
              }
              break;

            case 'discount':
              if (discountAmounts[option]) {
                try {
                  const discountResponse = await calculateDiscount({
                    product_id: productId.toString(),
                    discount_amount: discountAmounts[option],
                    discount: 'Applicable',
                  });
                  console.log('Discount API Response:', discountResponse);

                  if (discountResponse?.data?.status === 'Success') {
                    const responseData = discountResponse.data.data;
                    console.log('Discount Response data:', responseData);

                    if (responseData && responseData.grand_total) {
                      setCalculations((prev) => ({
                        ...prev,
                        [option]: {
                          ...prev[option],
                          discount: {
                            discount_amount: responseData.discount_amount,
                            vat_amount: responseData.vat_amount,
                            grand_total: responseData.grand_total,
                          },
                        },
                      }));
                      console.log(
                        'Successfully updated calculations with discount data'
                      );
                    } else {
                      console.error(
                        'Invalid data structure in discount response:',
                        responseData
                      );
                    }
                  } else {
                    console.error(
                      'Invalid discount response:',
                      discountResponse
                    );
                  }
                } catch (error) {
                  console.error('Error in discount calculation:', error);
                }
              }
              break;
          }
        } catch (error) {
          console.error(`Error calculating ${field}:`, error);
        }
      });
    }
  };

  // Fetch scopes when component mounts or when quotationId changes
  useEffect(() => {
    if (quotationId) {
      fetchScopes();
    }
  }, [quotationId]);

  // Function to fetch scopes
  const fetchScopes = async () => {
    if (!quotationId) return;

    setLoadingScopes(true);
    setScopeError(null);

    try {
      const response = await axiosInstance.get(
        `/list-scopeof-work/${quotationId}/`
      );
      if (response.data && response.data.data) {
        setScopes(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching scopes:', error);
      setScopeError('Failed to load scopes');
    } finally {
      setLoadingScopes(false);
    }
  };

  // Function to handle adding a scope
  const handleAddScope = async (scopeData) => {
    try {
      setIsScopeModalOpen(false);

      // Refresh scopes after adding
      await fetchScopes();

      // Show success modal
      setResultSuccess(true);
      setResultMessage('Scope added successfully');
      setShowResultModal(true);
    } catch (error) {
      console.error('Error adding scope:', error);

      // Show error modal
      setResultSuccess(false);
      setResultMessage('Failed to add scope');
      setShowResultModal(true);
    }
  };

  // Function to handle editing a scope
  const handleEditScope = async (scope) => {
    setSelectedOption(scope.options);
    setEditingScope(scope);
    setIsScopeModalOpen(true);
  };

  // Function to initiate scope deletion
  const handleDeleteInitiate = (scope) => {
    setScopeToDelete(scope);
    setShowConfirmModal(true);
  };

  // Function to handle scope deletion
  const handleDeleteScope = async () => {
    if (!scopeToDelete || !quotationId) return;

    setShowConfirmModal(false);

    try {
      await axiosInstance.delete(
        `/edit-delete-scope/${quotationId}/${scopeToDelete.id}/`
      );

      // Refresh scopes
      await fetchScopes();

      // Show success modal
      setResultSuccess(true);
      setResultMessage('Scope deleted successfully');
      setShowResultModal(true);
    } catch (error) {
      console.error('Error deleting scope:', error);

      // Show error modal
      setResultSuccess(false);
      setResultMessage('Failed to delete scope');
      setShowResultModal(true);
    }
  };

  // Group scopes by option
  const getScopesByOption = (optionName) => {
    return scopes.filter((scope) => scope.options === optionName);
  };

  // Get unique options that have scopes, sorted in correct order
  const getUniqueOptionsWithScopes = () => {
    // Extract all options from scopes
    const options = scopes.map((scope) => scope.options);
    // Get unique options
    const uniqueOptions = [...new Set(options)];

    // Define the correct order for options
    const optionOrder = {
      'Option 1': 1,
      'Option 2': 2,
      'Option 3': 3,
      'Option 4': 4,
    };

    // Sort options based on predefined order
    return uniqueOptions.sort((a, b) => {
      // If both options are in our order map, sort by the order values
      if (optionOrder[a] && optionOrder[b]) {
        return optionOrder[a] - optionOrder[b];
      }
      // If only one is in our order map, prioritize the one in the map
      if (optionOrder[a]) return -1;
      if (optionOrder[b]) return 1;
      // If neither is in our map, sort alphabetically
      return a.localeCompare(b);
    });
  };

  // Add this function to calculate initial total
  const getInitialTotal = (products) => {
    return products.reduce(
      (sum, product) => sum + Number(product.amount || 0),
      0
    );
  };

  // Product handling functions
  const handleAddProduct = async (product) => {
    try {
      if (!quotationId) {
        setResultSuccess(false);
        setResultMessage('Please save work details first');
        setShowResultModal(true);
        return;
      }

      product.set('quotation', quotationId.toString());
      console.log('Adding product with data:', {
        quotationId,
        productFormData: Object.fromEntries(product.entries()),
      });

      const result = await dispatch(addQuotationProduct(product)).unwrap();
      console.log('Add product API response:', result);

      if (result) {
        const selectedOption =
          optionValue === 'Not Applicable'
            ? 'Default Products'
            : product.get('option') || 'Option 1';

        const productData = {
          id: result.data.id,
          heading: product.get('heading'),
          description: product.get('description'),
          unit: product.get('unit'),
          quantity: product.get('quantity'),
          unit_price: product.get('unit_price'),
          amount: product.get('amount'),
          option: selectedOption,
          brand: product.get('brand'),
          location: product.get('location'),
          item_code: product.get('item_code'),
          work_order_number: product.get('work_order_number'),
          reference_number: product.get('reference_number'),
        };

        console.log('Setting productsByOption with:', {
          option: selectedOption,
          productData,
        });

        setProductsByOption((prev) => ({
          ...prev,
          [selectedOption]: [...(prev[selectedOption] || []), productData],
        }));

        // Store the product ID
        setProductIds((prev) => ({
          ...prev,
          [selectedOption]: result.data.id,
        }));

        setIsModalOpen(false);
        onProductsAdded();
      }
    } catch (error) {
      console.error('Failed to add product:', error);
      setResultSuccess(false);
      setResultMessage(error.message || 'Failed to add product');
      setShowResultModal(true);
    }
  };

  const handleEditProduct = (product) => {
    console.log('Edit product:', product);
  };

  const handleDeleteProduct = (optionName, productIndex) => {
    setProductsByOption((prev) => ({
      ...prev,
      [optionName]: [
        prev[optionName][0].filter((_, i) => i !== productIndex),
        ...prev[optionName].slice(1),
      ],
    }));

    // Remove the product ID when deleting the product
    if (productsByOption[optionName][0].length === 1) {
      const updatedProducts = { ...productsByOption };
      delete updatedProducts[optionName];
      setProductsByOption(updatedProducts);

      // Also remove the product ID
      setProductIds((prev) => {
        const updated = { ...prev };
        delete updated[optionName];
        return updated;
      });
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
  const calculateLocalVAT = (amount) => {
    return amount * 0.05;
  };

  // Calculate final total with discount and VAT
  const calculateFinalTotal = (baseTotal, option) => {
    const discount =
      dropdownValues.discount === 'Applicable'
        ? Number(discountAmounts[option] || 0)
        : 0;

    const afterDiscount = baseTotal - discount;

    const vat =
      dropdownValues.vat === 'Applicable'
        ? calculateLocalVAT(afterDiscount)
        : 0;

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
  
    // Only trigger calculation if discount is applicable
    if (dropdownValues.discount === 'Applicable') {
      const productId = productsByOption[option]?.[0]?.id;
      if (productId) {
        debouncedDiscountCalculation(productId, value, option);
      }
    }
  };
  
  // Update the debounced discount calculation
  const debouncedDiscountCalculation = useCallback(
    debounce(async (productId, discountAmount, option) => {
      try {
        const response = await calculateDiscount({
          product_id: productId.toString(),
          discount_amount: discountAmount,
          discount: 'Applicable',
        });
  
        if (response?.status === 'Success' && response?.data) {
          setCalculations((prev) => ({
            ...prev,
            [option]: {
              ...prev[option],
              discount: {
                discount_amount: response.data.discount_amount,
                vat_amount: response.data.vat_amount,
                grand_total: response.data.grand_total,
              },
            },
          }));
        }
      } catch (error) {
        console.error('Error calculating discount:', error);
      }
    }, 500),
    []
  );

  const [calculations, setCalculations] = useState({});

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
            onClick={() => {
              setEditingScope(null);
              setSelectedOption('Option 1'); // Default to Option 1 for new scopes
              setIsScopeModalOpen(true);
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            <IoIosAdd className="text-[1.5rem] sm:text-[2rem]" />
            Add Scope
          </button>
        )}
      </div>

      {/* Product Tables */}
      {Object.entries(productsByOption).map(([option, products]) => (
        <div key={option}>
          <ProductTable
            products={products}
            selectedColumns={selectedColumns}
            onEdit={handleEditProduct}
            onDelete={(index) => handleDeleteProduct(option, index)}
            optionName={option}
          />

          <div className="flex flex-col gap-2 items-end mt-4 mb-6">
            {/* Sub Total */}
            {dropdownValues.subTotal === 'Applicable' && (
              <div className="bg-gray-50 px-4 py-2 rounded-lg">
                <span className="text-sm font-medium text-gray-600">
                  Sub Total:
                </span>
                <span className="ml-2 text-sm font-semibold text-gray-900">
                  $
                  {calculations[option]?.subTotal ||
                    getInitialTotal(products).toFixed(2)}
                </span>
              </div>
            )}

            {/* Discount input */}
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

            {/* VAT */}
            {dropdownValues.vat === 'Applicable' && (
              <div className="bg-gray-50 px-4 py-2 rounded-lg">
                <span className="text-sm font-medium text-gray-600">
                  VAT (5%):
                </span>
                <span className="ml-2 text-sm font-semibold text-gray-900">
                  ${calculations[option]?.vat?.vat_amount || '0.00'}
                </span>
              </div>
            )}

            {/* Grand Total */}
            <div className="bg-blue-50 px-6 py-3 rounded-lg">
              <span className="text-base font-medium text-blue-700">
                {option} Grand Total:
              </span>
              <span className="ml-3 text-lg font-semibold text-blue-900">
                $
                {(calculations[option]?.discount?.grand_total ||
                  calculations[option]?.vat?.grand_total ||
                  getInitialTotal(products))?.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* Separate Scope of Work section - only show if applicable */}
      {dropdownValues.scopeOfWork === 'Applicable' && (
        <div className="mt-8">
          {loadingScopes ? (
            <div className="text-center py-4 text-gray-500">
              Loading scopes...
            </div>
          ) : scopeError ? (
            <div className="text-center py-4 text-red-500">{scopeError}</div>
          ) : scopes.length === 0 ? (
            <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500 border border-gray-200">
              No scope of work items added yet. Click "Add Scope" to add scope
              of work.
            </div>
          ) : (
            // Only map through options that actually have scopes, and sort them
            getUniqueOptionsWithScopes().map((option) => {
              const optionScopes = getScopesByOption(option);

              return (
                <div key={option} className="mb-6">
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b">
                      <h3 className="font-semibold text-gray-700">
                        Scope Of Work: {option}
                      </h3>
                      <button
                        onClick={() => {
                          setSelectedOption(option);
                          setEditingScope(null);
                          setIsScopeModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <IoIosAdd className="text-lg" />
                        <span>Add Scope</span>
                      </button>
                    </div>

                    <div className="p-6">
                      <div className="space-y-4">
                        {optionScopes.map((scope, index) => (
                          <div
                            key={scope.id || index}
                            className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium text-gray-800">
                                Scope {index + 1}
                              </h4>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditScope(scope)}
                                  className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                  title="Edit scope"
                                >
                                  <FaEdit size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteInitiate(scope)}
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
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 p-8 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Confirm Deletion
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this scope of work? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteScope}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result Modal */}
      {showResultModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 p-8 shadow-xl">
            <div
              className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                resultSuccess
                  ? 'bg-green-100 text-green-500'
                  : 'bg-red-100 text-red-500'
              }`}
            >
              {resultSuccess ? (
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              )}
            </div>
            <h2
              className={`text-xl font-semibold text-center mb-2 ${
                resultSuccess ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {resultSuccess ? 'Success' : 'Error'}
            </h2>
            <p className="text-gray-600 text-center mb-6">{resultMessage}</p>
            <div className="flex justify-center">
              <button
                onClick={() => setShowResultModal(false)}
                className={`px-6 py-2 rounded-lg text-white ${
                  resultSuccess
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedColumns={selectedColumns}
        onAdd={handleAddProduct}
        showOptions={optionValue === 'Applicable'}
        quotationId={quotationId}
      />

      {/* Scope Modal */}
      <ScopeModal
        isOpen={isScopeModalOpen}
        onClose={() => setIsScopeModalOpen(false)}
        onAdd={handleAddScope}
        initialData={editingScope}
        defaultOption={selectedOption}
        quotationId={quotationId}
      />
    </div>
  );
};

export default ProductDetails;
