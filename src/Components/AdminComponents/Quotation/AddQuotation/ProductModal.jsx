import React, { useState, useEffect } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
} from 'react-icons/fa';

const ProductModal = ({
  isOpen,
  onClose,
  selectedColumns,
  onAdd,
  showOptions,
  quotationId,
}) => {
  // Move all useState hooks to the top, before any conditional returns
  const [editorState, setEditorState] = useState({
    bold: false,
    italic: false,
    underline: false,
    orderedList: false,
    unorderedList: false,
  });

  const [description, setDescription] = useState('');
  const [heading, setHeading] = useState('Not Applicable');
  const [brand, setBrand] = useState('');
  const [location, setLocation] = useState('');
  const [itemCode, setItemCode] = useState('');
  const [workOrderNumber, setWorkOrderNumber] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [unit, setUnit] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedOption, setSelectedOption] = useState('Option 1');
  const [photo, setPhoto] = useState(null);

  const optionChoices = ['Option 1', 'Option 2', 'Option 3', 'Option 4']; // Valid option choices

  // useEffect hook should also be before any conditional returns
  useEffect(() => {
    if (quantity && unitPrice) {
      setAmount((Number(quantity) * Number(unitPrice)).toString());
    } else {
      setAmount('');
    }
  }, [quantity, unitPrice]);

  // Now we can have the conditional return
  if (!isOpen) return null;

  const handleFormat = (command) => {
    console.log('handleFormat called with:', command);
    const editor = document.getElementById('editor');

    if (!editor) {
      console.error('Editor element not found');
      return;
    }

    // Focus the editor
    editor.focus();

    if (command === 'orderedList' || command === 'unorderedList') {
      // Get current content
      const currentContent = editor.innerHTML.trim();

      // Create new list structure based on list type
      const listTag = command === 'orderedList' ? 'ol' : 'ul';
      const listStyle = command === 'orderedList' ? 'decimal' : 'disc';

      const listHtml = `
        <${listTag} style="list-style-type: ${listStyle}; margin-left: 20px;">
          <li></li>
        </${listTag}>
      `;

      // If empty or just a paragraph tag, replace entirely
      if (
        !currentContent ||
        currentContent === '<p></p>' ||
        currentContent === '<br>'
      ) {
        editor.innerHTML = listHtml;
      } else {
        // If there's content, wrap it in a list item
        const wrappedContent = `
          <${listTag} style="list-style-type: ${listStyle}; margin-left: 20px;">
            <li>${currentContent}</li>
          </${listTag}>
        `;
        editor.innerHTML = wrappedContent;
      }

      // Place cursor at end of first list item
      const li = editor.querySelector('li');
      if (li) {
        const range = document.createRange();
        const sel = window.getSelection();

        // Set cursor at start of li
        range.setStart(li, 0);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }

      setEditorState((prev) => ({
        ...prev,
        [command]: true,
        // Ensure only one list type is active at a time
        orderedList: command === 'orderedList',
        unorderedList: command === 'unorderedList',
      }));
    } else {
      document.execCommand(command, false, null);
      setEditorState((prev) => ({
        ...prev,
        [command]: !prev[command],
      }));
    }
  };

  // Update handleKeyDown to work with both list types
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const listItem = range.startContainer.closest('li');

      if (listItem) {
        // If list item is empty (except for <br>)
        if (listItem.textContent.trim() === '') {
          e.preventDefault();

          const list = listItem.parentElement;
          const parentList = list.parentElement;
          const isOrderedList = list.tagName.toLowerCase() === 'ol';

          // Remove the empty list item
          list.removeChild(listItem);

          // If this was the last item, remove the list
          if (list.children.length === 0) {
            parentList.removeChild(list);

            // Add a new paragraph
            const p = document.createElement('p');
            p.appendChild(document.createElement('br'));
            editor.appendChild(p);

            // Move cursor to new paragraph
            const newRange = document.createRange();
            newRange.setStart(p, 0);
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);

            setEditorState((prev) => ({
              ...prev,
              orderedList: false,
              unorderedList: false,
            }));
          }
        }
      }
    }
  };

  const handleSelect = (e) => {
    const format = e.target.value;

    // Save current selection
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);

    // Apply heading format
    document.execCommand('formatBlock', false, format);

    // Restore selection
    selection.removeAllRanges();
    selection.addRange(range);

    // Update description state without losing focus
    const editor = document.getElementById('editor');
    setDescription(editor.innerHTML);
  };

  const handleEditorChange = (e) => {
    // Simply update the description without trying to manage cursor
    setDescription(e.currentTarget.innerHTML);
  };

  // Update the editor styles
  const editorStyles = {
    minHeight: '120px',
    padding: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '0.375rem',
    backgroundColor: 'white',
    outline: 'none',
    listStylePosition: 'inside',
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Photo selected:', file.name);
      setPhoto(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('Starting product submission...');
    
    const productData = {
      quotation: quotationId?.toString() || '',
      heading: heading || '',
      description: description || '',
      unit: unit || '',
      quantity: quantity || '',
      unit_price: unitPrice || '',
      amount: amount || '',
      grand_total: amount || '',
      option: selectedOption || '',
      photo: photo,
      brand: brand || '',
      location: location || '',
      item_code: itemCode || '',
      work_order_number: workOrderNumber || '',
      reference_number: referenceNumber || ''
    };

    console.log('Complete product data being submitted:', productData);
    onAdd(productData);
  };

  return (
    <div className="fixed inset-0 z-50 w-full">
      {/* Overlay with blur effect */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity w-full h-full"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex items-center justify-center h-[90vh] p-4 overflow-y-scroll">
        <div className="relative bg-white rounded-xl h-[90vh] shadow-2xl w-full max-w-4xl mx-auto overflow-y-scroll">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-semibold text-gray-800">
              Add Product
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all"
            >
              <IoCloseOutline size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Options dropdown when applicable */}
            {showOptions && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Options
                </label>
                <select
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                >
                  {optionChoices.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Always show Heading and Description first */}
            <div className="grid grid-cols-1 gap-6">
              {/* Heading */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Heading
                </label>
                <select
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="Not Applicable">Not Applicable</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Painting">Painting</option>
                  <option value="Carpentry">Carpentry</option>
                  <option value="Waterproofing">Waterproofing</option>
                  <option value="Reinstatement">Reinstatement</option>
                  <option value="Hvac">Hvac</option>
                </select>
              </div>

              {/* Description with Text Editor */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  {/* Editor Container */}
                  <div className="border rounded-lg">
                    {/* Toolbar */}
                    <div className="flex items-center gap-1 p-2 border-b bg-gray-50">
                      <select
                        className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleSelect}
                        defaultValue="p"
                      >
                        <option value="p">Normal</option>
                        <option value="h1">Heading 1</option>
                      </select>
                      <div className="h-6 w-px bg-gray-300 mx-2" />
                      <button
                        className={`p-1.5 rounded-lg transition-colors hover:bg-gray-100 active:bg-gray-200 ${
                          editorState.bold ? 'bg-gray-200' : ''
                        }`}
                        onClick={() => handleFormat('bold')}
                        type="button"
                      >
                        <FaBold className="w-4 h-4" />
                      </button>
                      <button
                        className={`p-1.5 rounded-lg transition-colors hover:bg-gray-100 active:bg-gray-200 ${
                          editorState.italic ? 'bg-gray-200' : ''
                        }`}
                        onClick={() => handleFormat('italic')}
                        type="button"
                      >
                        <FaItalic className="w-4 h-4" />
                      </button>
                      <button
                        className={`p-1.5 rounded-lg transition-colors hover:bg-gray-100 active:bg-gray-200 ${
                          editorState.underline ? 'bg-gray-200' : ''
                        }`}
                        onClick={() => handleFormat('underline')}
                        type="button"
                      >
                        <FaUnderline className="w-4 h-4" />
                      </button>

                      {/* Add divider */}
                      <div className="h-6 w-px bg-gray-300 mx-2" />

                      {/* Add list buttons */}
                      <button
                        className={`p-1.5 rounded-lg transition-colors hover:bg-gray-100 active:bg-gray-200 ${
                          editorState.unorderedList ? 'bg-gray-200' : ''
                        }`}
                        onClick={() => handleFormat('unorderedList')}
                        type="button"
                      >
                        <FaListUl className="w-4 h-4" />
                      </button>
                      <button
                        className={`p-1.5 rounded-lg transition-colors hover:bg-gray-100 active:bg-gray-200 ${
                          editorState.orderedList ? 'bg-gray-200' : ''
                        }`}
                        onClick={() => {
                          console.log('Ordered list button clicked');
                          handleFormat('orderedList');
                        }}
                        type="button"
                      >
                        <FaListOl className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Editor Area - Moved outside the toolbar */}
                    <div
                      id="editor"
                      contentEditable="true"
                      className="w-full focus:outline-none"
                      style={editorStyles}
                      onInput={handleEditorChange}
                      onKeyDown={handleKeyDown}
                      suppressContentEditableWarning={true}
                      // dangerouslySetInnerHTML={{
                      //   __html: description || '<p><br></p>',
                      // }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Photo Upload */}
              {selectedColumns.Photo && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Photo
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="w-full h-32 flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-all group">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {photo ? (
                          <div className="text-sm text-gray-600">
                            Selected: {photo.name}
                          </div>
                        ) : (
                          <>
                            <svg
                              className="w-8 h-8 text-gray-400 group-hover:text-gray-500 transition-colors"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <p className="mt-2 text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                              Click to upload
                            </p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handlePhotoChange}
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Brand */}
              {selectedColumns.Brand && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter brand"
                  />
                </div>
              )}

              {/* Location */}
              {selectedColumns.Location && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter location"
                  />
                </div>
              )}

              {/* Item Code */}
              {selectedColumns.ItemCode && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Item Code
                  </label>
                  <input
                    type="text"
                    value={itemCode}
                    onChange={(e) => setItemCode(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter item code"
                  />
                </div>
              )}

              {/* Work Order Number */}
              {selectedColumns.WorkOrderNumber && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Work Order Number
                  </label>
                  <input
                    type="text"
                    value={workOrderNumber}
                    onChange={(e) => setWorkOrderNumber(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter work order number"
                  />
                </div>
              )}

              {/* Reference Number */}
              {selectedColumns.ReferenceNumber && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Reference Number
                  </label>
                  <input
                    type="text"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter reference number"
                  />
                </div>
              )}

              {/* Unit */}
              {selectedColumns.Unit && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Unit
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="">Select unit</option>
                    <option value="box">Box</option>
                    <option value="bundle">Bundle</option>
                    <option value="bag">Bag</option>
                    <option value="carton">Carton</option>
                    <option value="can">Can</option>
                    <option value="drum">Drum</option>
                    <option value="each">Each</option>
                    <option value="guage">Guage</option>
                    <option value="inch">Inch</option>
                    <option value="kilogram">Kilogram</option>
                    <option value="ls">Ls</option>
                    <option value="lm">LM</option>
                    <option value="m2">M2</option>
                    <option value="m3">M3</option>
                    <option value="mtr">Mtr</option>
                    <option value="nos">Nos</option>
                    <option value="piece">Piece</option>
                    <option value="roll">Roll</option>
                    <option value="rm">Rm</option>
                    <option value="sheet">Sheet</option>
                    <option value="squareMetre">Square metre</option>
                    <option value="sqmt">sqmt</option>
                  </select>
                </div>
              )}

              {/* Quantity */}
              {selectedColumns.Quantity && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter quantity"
                  />
                </div>
              )}

              {/* Unit Price */}
              {selectedColumns.UnitPrice && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Unit Price
                  </label>
                  <input
                    type="number"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter unit price"
                  />
                </div>
              )}

              {/* Amount */}
              {selectedColumns.Amount && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={amount}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Amount"
                    disabled
                  />
                </div>
              )}
            </div>
          </div>

          {/* Footer with modern styling */}
          <div className="flex items-center justify-end gap-4 p-6 border-t bg-gray-50 rounded-xl">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
