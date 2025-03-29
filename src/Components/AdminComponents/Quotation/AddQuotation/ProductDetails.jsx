import React, { useState, useEffect } from 'react';
import { IoIosAdd } from 'react-icons/io';
import { FaEdit, FaTrash } from 'react-icons/fa';
import ProductModal from './ProductModal';
import ProductTable from './ProductTable';
import ScopeModal from './ScopeModal';
import { useDispatch, useSelector } from 'react-redux';
import {
  addQuotationProduct,
  fetchQuotationProducts,
  deleteQuotationProduct,
  updateQuotationProduct,
} from '../../../../store/slices/quotationProductsSlice';
import axiosInstance from '../../../../Config/axiosInstance';

const ProductDetails = ({ optionValue, onProductsAdded = () => {} }) => {
  const dispatch = useDispatch();
  const quotationId = useSelector((state) => state.quotation.id);
  const quotationProducts = useSelector(
    (state) => state.quotationProducts.products
  );
  const loading = useSelector((state) => state.quotationProducts.loading);

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

  // Add these new state variables
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  // Add new state for storing amount IDs
  const [amountIds, setAmountIds] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Column toggle handler
  const handleColumnToggle = (columnName) => {
    setSelectedColumns((prev) => ({
      ...prev,
      [columnName]: !prev[columnName],
    }));
  };

  // Dropdown change handler
  const handleDropdownChange = (field, value) => {
    setDropdownValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (quotationId) {
      fetchScopes();
    }
  }, [quotationId]);

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

  const handleAddScope = async (scopeData) => {
    try {
      setIsScopeModalOpen(false);

      await fetchScopes();

      setResultSuccess(true);
      setResultMessage('Scope added successfully');
      setShowResultModal(true);
    } catch (error) {
      console.error('Error adding scope:', error);
      setResultSuccess(false);
      setResultMessage('Failed to add scope');
      setShowResultModal(true);
    }
  };

  //editing scope
  const handleEditScope = async (scope) => {
    setSelectedOption(scope.options);
    setEditingScope(scope);
    setIsScopeModalOpen(true);
  };

  //initiate scope deletion
  const handleDeleteInitiate = (scope) => {
    setScopeToDelete(scope);
    setShowConfirmModal(true);
  };

  //scope deletion
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

  const getUniqueOptionsWithScopes = () => {
    const options = scopes.map((scope) => scope.options);

    const uniqueOptions = [...new Set(options)];

    const optionOrder = {
      'Option 1': 1,
      'Option 2': 2,
      'Option 3': 3,
    };

    return uniqueOptions.sort((a, b) => {
      if (optionOrder[a] && optionOrder[b]) {
        return optionOrder[a] - optionOrder[b];
      }
      if (optionOrder[a]) return -1;
      if (optionOrder[b]) return 1;
      return a.localeCompare(b);
    });
  };

  useEffect(() => {
    if (quotationId) {
      dispatch(fetchQuotationProducts(quotationId));
    }
  }, [dispatch, quotationId]);

  useEffect(() => {
    if (quotationProducts && Array.isArray(quotationProducts)) {
      const formattedProducts = {};

      quotationProducts.forEach((optionGroup) => {
        if (optionGroup && optionGroup.products) {
          const optionKey =
            optionValue === 'Not Applicable'
              ? 'Default Products'
              : optionGroup.option;
          formattedProducts[optionKey] = optionGroup.products || [];
        }
      });

      setProductsByOption(formattedProducts);
    }
  }, [quotationProducts, optionValue]);

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

      if (optionValue === 'Not Applicable') {
        product.delete('option');
      }

      console.log('Sending product data:', product);
      const result = await dispatch(addQuotationProduct(product)).unwrap();

      if (result) {
        setResultSuccess(true);
        setResultMessage('Product added successfully');
        setShowResultModal(true);

        const productData = {
          heading: product.get('heading'),
          description: product.get('description'),
          unit: product.get('unit'),
          quantity: product.get('quantity'),
          unit_price: product.get('unit_price'),
          amount: product.get('amount'),
          brand: product.get('brand'),
          location: product.get('location'),
          item_code: product.get('item_code'),
          work_order_number: product.get('work_order_number'),
          reference_number: product.get('reference_number'),
        };

        const displayOption =
          optionValue === 'Not Applicable'
            ? 'Default Products'
            : product.get('option');

        setProductsByOption((prev) => ({
          ...prev,
          [displayOption]: [...(prev[displayOption] || []), productData],
        }));

        setIsModalOpen(false);
        if (typeof onProductsAdded === 'function') {
          onProductsAdded();
        }
      }
    } catch (error) {
      console.error('Failed to add product:', error);
      setResultSuccess(false);
      setResultMessage(error.message || 'Failed to add product');
      setShowResultModal(true);
    }
  };

  const handleEditProduct = (product) => {
    setProductToEdit(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteInitiateProduct = (option, product) => {
    setProductToDelete({
      id: product.id,
      option: option,
    });
    setShowDeleteConfirmModal(true);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete || !quotationId) return;

    setShowDeleteConfirmModal(false);

    try {
      await dispatch(
        deleteQuotationProduct({
          quotationId,
          productId: productToDelete.id,
        })
      ).unwrap();

      //success modal
      setResultSuccess(true);
      setResultMessage('Product deleted successfully');
      setShowResultModal(true);

      await dispatch(fetchQuotationProducts(quotationId));

      if (productToDelete.option) {
        setProductsByOption((prev) => {
          const updated = { ...prev };

          if (updated[productToDelete.option]) {
            updated[productToDelete.option] = updated[
              productToDelete.option
            ].filter((product) => product.id !== productToDelete.id);

            if (updated[productToDelete.option].length === 0) {
              delete updated[productToDelete.option];
            }
          }

          return updated;
        });
      }
    } catch (error) {
      console.error('Error deleting product:', error);

      //error modal
      setResultSuccess(false);
      setResultMessage(error.message || 'Failed to delete product');
      setShowResultModal(true);
    }
  };

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      if (!quotationId) {
        setResultSuccess(false);
        setResultMessage('Please save work details first');
        setShowResultModal(true);
        return;
      }

      if (!productToEdit || !productToEdit.id) {
        setResultSuccess(false);
        setResultMessage('Invalid product data for update');
        setShowResultModal(true);
        return;
      }

      updatedProduct.set('quotation', quotationId.toString());
      setIsEditModalOpen(false);

      const result = await dispatch(
        updateQuotationProduct({
          quotationId,
          productId: productToEdit.id,
          formData: updatedProduct,
        })
      ).unwrap();

      if (result) {
        //success modal
        setResultSuccess(true);
        setResultMessage('Product updated successfully');
        setShowResultModal(true);

        //edit state
        setProductToEdit(null);

        dispatch(fetchQuotationProducts(quotationId));
      }
    } catch (error) {
      console.error('Failed to update product:', error);
      setResultSuccess(false);
      setResultMessage(error.message || 'Failed to update product');
      setShowResultModal(true);
    }
  };

  // Add helper function to round numbers and ensure proper format
  const formatAmount = (amount) => {
    // Round to 2 decimal places and ensure no more than 12 total digits
    const rounded = Number(amount).toFixed(2);
    // If number is too large, truncate to max 12 digits (including decimals)
    if (rounded.replace('.', '').length > 12) {
      const max = Math.pow(10, 9) - 0.01; // Maximum 9 digits before decimal + 2 after
      return Math.min(Number(rounded), max).toFixed(2);
    }
    return rounded;
  };

  const handleSaveAmounts = async () => {
    if (!quotationId) {
      setResultSuccess(false);
      setResultMessage('Please save work details first');
      setShowResultModal(true);
      return;
    }

    setIsSaving(true);
    try {
      // Separate payloads for new and existing records
      const updatePayload = [];
      const createPayload = [];

      // Prepare and separate the payloads
      getSortedOptions(productsByOption).forEach((option) => {
        const products = productsByOption[option] || [];
        const baseTotal = calculateTableTotal(products);
        const totals = calculateFinalTotal(baseTotal, option);
        const optionKey = option === 'Default Products' ? 'Option 1' : option;

        const basePayload = {
          quotation: quotationId.toString(),
          option: optionKey,
          vat_amount: formatAmount(totals.vat),
          discount_amount: formatAmount(totals.discount),
          subtotal_amount: formatAmount(totals.baseTotal),
          grand_total: formatAmount(totals.finalTotal),
        };

        // If we have an ID for this option, add to update payload
        if (amountIds[optionKey]) {
          updatePayload.push({
            ...basePayload,
            id: amountIds[optionKey].toString(),
          });
        } else {
          // If no ID, add to create payload
          createPayload.push(basePayload);
        }
      });

      let response;

      // Handle updates first if any exist
      if (updatePayload.length > 0) {
        response = await axiosInstance.patch('/edit-amounts/', updatePayload);
      }

      // Handle new records if any exist
      if (createPayload.length > 0) {
        const createResponse = await axiosInstance.post(
          '/add-amounts/',
          createPayload
        );

        // Store new IDs
        if (createResponse.data?.data) {
          const newIds = {};
          createResponse.data.data.forEach((item) => {
            newIds[item.option] = item.id;
          });
          // Merge with existing IDs
          setAmountIds((prev) => ({
            ...prev,
            ...newIds,
          }));
        }
      }

      setResultSuccess(true);
      setResultMessage('Product details saved successfully');
      setShowResultModal(true);
    } catch (error) {
      console.error('Error saving amounts:', error);
      setResultSuccess(false);
      setResultMessage(
        error.response?.data?.message?.vat_amount?.[0] ||
          error.response?.data?.message ||
          'Failed to save product details'
      );
      setShowResultModal(true);
    } finally {
      setIsSaving(false);
    }
  };

  // Update the calculateVAT function to use formatting
  const calculateVAT = (amount) => {
    return Number(formatAmount(amount * 0.05));
  };

  // Update the calculateFinalTotal function to use formatting
  const calculateFinalTotal = (baseTotal, option) => {
    const discount =
      dropdownValues.discount === 'Applicable'
        ? Number(discountAmounts[option] || 0)
        : 0;

    const afterDiscount = baseTotal - discount;
    const vat =
      dropdownValues.vat === 'Applicable' ? calculateVAT(afterDiscount) : 0;

    return {
      baseTotal: Number(formatAmount(baseTotal)),
      discount: Number(formatAmount(discount)),
      afterDiscount: Number(formatAmount(afterDiscount)),
      vat: Number(formatAmount(vat)),
      finalTotal: Number(formatAmount(afterDiscount + vat)),
    };
  };

  // Update the calculateTableTotal function to use formatting
  const calculateTableTotal = (products) => {
    if (!products || !Array.isArray(products)) {
      return 0;
    }
    const total = products.reduce(
      (sum, product) => sum + Number(product.amount || 0),
      0
    );
    return Number(formatAmount(total));
  };

  // Handle discount input change
  const handleDiscountChange = (option, value) => {
    setDiscountAmounts((prev) => ({
      ...prev,
      [option]: value,
    }));
  };

  const getSortedOptions = (productOptions) => {
    if (optionValue === 'Not Applicable') {
      return ['Default Products'];
    }

    const optionOrder = {
      'Option 1': 1,
      'Option 2': 2,
      'Option 3': 3,
    };

    return Object.keys(productOptions).sort((a, b) => {
      if (optionOrder[a] && optionOrder[b]) {
        return optionOrder[a] - optionOrder[b];
      }

      if (optionOrder[a]) return -1;
      if (optionOrder[b]) return 1;

      return a.localeCompare(b);
    });
  };

  // Add useEffect to reset amountIds when optionValue changes
  useEffect(() => {
    setAmountIds({}); // Reset IDs when option value changes
  }, [optionValue]);

  // Log amountIds whenever it changes (for debugging)
  useEffect(() => {
    console.log('Current amountIds:', amountIds);
  }, [amountIds]);

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
              setSelectedOption('Option 1');
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
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : Object.keys(productsByOption).length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No products added yet. Click "Add Line Item" to add products.
        </div>
      ) : (
        getSortedOptions(productsByOption).map((option) => {
          const products = productsByOption[option] || [];

          return (
            <div key={option}>
              <ProductTable
                products={products}
                selectedColumns={selectedColumns}
                onEdit={handleEditProduct}
                onDelete={(product) =>
                  handleDeleteInitiateProduct(option, product)
                }
                optionName={option}
              />

              {/* Table Totals */}
              <div className="flex flex-col gap-2 items-end mt-4 mb-6">
                {(() => {
                  const baseTotal = calculateTableTotal(products);
                  const totals = calculateFinalTotal(baseTotal, option);

                  return (
                    <>
                      {dropdownValues.subTotal === 'Applicable' && (
                        <div className="bg-gray-50 px-4 py-2 rounded-lg">
                          <span className="text-sm font-medium text-gray-600">
                            Sub Total:
                          </span>
                          <span className="ml-2 text-sm font-semibold text-gray-900">
                            ₹{baseTotal.toFixed(2)}
                          </span>
                        </div>
                      )}

                      <div className="bg-gray-50 px-4 py-2 rounded-lg">
                        <span className="text-sm font-medium text-gray-600">
                          Total Amount:
                        </span>
                        <span className="ml-2 text-sm font-semibold text-gray-900">
                          ₹{baseTotal.toFixed(2)}
                        </span>
                      </div>

                      {/* Discount input when applicable */}
                      {dropdownValues.discount === 'Applicable' && (
                        <div className="bg-gray-50 px-4 py-2 rounded-lg flex items-center">
                          <span className="text-sm font-medium text-gray-600 mr-2">
                            Discount:
                          </span>
                          <div className="flex items-center">
                            <span className="text-gray-600 mr-1">₹</span>
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
                            ₹{totals.afterDiscount.toFixed(2)}
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
                            ₹{totals.vat.toFixed(2)}
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
                    ₹
                    {calculateFinalTotal(
                      calculateTableTotal(products),
                      option
                    ).finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          );
        })
      )}

      {/* Modified save button */}
      {Object.keys(productsByOption).length > 0 && (
        <div className="flex justify-end mt-8">
          <button
            onClick={handleSaveAmounts}
            disabled={isSaving}
            className={`flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all ${
              isSaving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
                <span>Save Product Details</span>
              </>
            )}
          </button>
        </div>
      )}

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
          ) : optionValue === 'Applicable' ? (
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
          ) : (
            //single scope section for Not Applicable
            <div className="mb-6">
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b">
                  <h3 className="font-semibold text-gray-700">
                    Default Scope Of Work
                  </h3>
                  <button
                    onClick={() => {
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
                    {scopes.map((scope, index) => (
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

      {/*Delete Product Confirmation Modal */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 p-8 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Confirm Product Deletion
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
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
        defaultOption={optionValue}
        quotationId={quotationId}
        showOptions={optionValue === 'Applicable'}
      />

      {/* Edit Product Modal */}
      <ProductModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setProductToEdit(null);
        }}
        selectedColumns={selectedColumns}
        onAdd={handleUpdateProduct}
        showOptions={optionValue === 'Applicable'}
        quotationId={quotationId}
        initialData={productToEdit}
        isEditing={true}
      />
    </div>
  );
};

export default ProductDetails;
