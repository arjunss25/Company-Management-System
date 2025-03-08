import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { MdOutlineRemoveCircleOutline } from 'react-icons/md';
import { IoMdAdd } from 'react-icons/io';
import { AdminApi } from '../../../Services/AdminApi';
import { IoIosArrowDown } from 'react-icons/io';

const AddRateCardItemModal = ({ isOpen, onClose, rateCardId, onSuccess }) => {
  // Move all useState declarations to the top
  const [rateCards, setRateCards] = useState([]);
  const [searchRateCard, setSearchRateCard] = useState('');
  const [isRateCardDropdownOpen, setIsRateCardDropdownOpen] = useState(false);
  const [units, setUnits] = useState([]);
  const [formData, setFormData] = useState({
    itemName: '',
    unit: '',
    opexCapex: '',
    workType: '',
    material: '',
    underRateCard: '',
    rate: '',
    area: '',
    flatType: '',
    materialName: '',
    materialUnder: '',
    materialUnit: '',
    materialQuantity: '',
    materials: [],
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rateCardsResponse, unitsResponse] = await Promise.all([
          AdminApi.listRateCards(),
          AdminApi.listUnits()
        ]);
        setRateCards(rateCardsResponse.data || []);
        setUnits(unitsResponse.data || []); // Update this line to access the correct data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);
  // Filter function for rate cards
  const filteredRateCards = rateCards.filter(
    (rateCard) =>
      rateCard.card_name &&
      rateCard.card_name.toLowerCase().includes(searchRateCard.toLowerCase())
  );
  // Toggle function
  const toggleRateCardDropdown = () => {
    setIsRateCardDropdownOpen(!isRateCardDropdownOpen);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleMaterialChange = (index, e) => {
    const { name, value } = e.target;
    const newMaterials = [...formData.materials];
    newMaterials[index] = { ...newMaterials[index], [name]: value };
    setFormData((prev) => ({
      ...prev,
      materials: newMaterials,
    }));
  };
  const addMaterial = () => {
    setFormData((prev) => ({
      ...prev,
      materials: [
        ...prev.materials,
        { name: '', under: '', unit: '', quantity: '' },
      ],
    }));
  };
  const removeMaterial = (index) => {
    const newMaterials = formData.materials.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      materials: newMaterials,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        rate_card: formData.underRateCard, // Use the selected rate card ID
        companyid: 1,
        item_name: formData.itemName,
        unit: parseInt(formData.unit),
        rate: parseFloat(formData.rate),
        opex_or_capex: formData.opexCapex === 'opex' ? 'Opex' : 'Capex',
        area: formData.area || 'Overall',
        material: formData.material === 'applicable' ? 'Applicable' : 'Not Applicable',
        materials: formData.material === 'applicable' ? formData.materials.map(material => ({
          material_category: material.under,
          material_name: material.name,
          quantity: parseFloat(material.quantity),
          second_unit: parseInt(material.unit)
        })) : []
      };
      await AdminApi.addRateCardItem(payload);
      onSuccess?.(); // Callback to refresh the list
      onClose();
    } catch (error) {
      console.error('Error adding rate card item:', error);
      // You might want to show an error message to the user
    }
  };
  const handleReset = () => {
    setFormData({
      itemName: '',
      unit: '',
      opexCapex: '',
      material: '',
      underRateCard: '',
      rate: '',
      area: '',
      materialName: '',
      materialUnder: '',
      materialUnit: '',
      materialQuantity: '',
      materials: [],
    });
  };
  const SelectWithIcon = ({
    label,
    name,
    value,
    onChange,
    className,
    children,
  }) => (
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full pl-3 pr-10 py-2 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm sm:text-base appearance-none ${className}`}
      >
        {children}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
        <MdKeyboardArrowDown size={24} />
      </div>
    </div>
  );
  if (!isOpen) return null;
  // Update the form section where the underRateCard dropdown is
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl p-4 sm:p-6 w-full max-w-4xl relative z-50 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Rate Card Item
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Item Name:
              </label>
              <input
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleInputChange}
                className="w-full pl-3 pr-3 py-2 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                placeholder="Item Name"
              />
            </div>

            <div className="space-y-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Under Rate Card:
                </label>
                <div className="relative">
                  <div
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 cursor-pointer flex justify-between items-center"
                    onClick={toggleRateCardDropdown}
                  >
                    <span>
                      {rateCards.find(
                        (rateCard) => rateCard.id === formData.underRateCard
                      )?.card_name || 'Select Rate Card'}
                    </span>
                    <IoIosArrowDown
                      className={`transform transition-transform ${
                        isRateCardDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                  {isRateCardDropdownOpen && (
                    <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                      <div className="p-2 border-b">
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-200 rounded-md"
                          placeholder="Search rate cards..."
                          value={searchRateCard}
                          onChange={(e) => setSearchRateCard(e.target.value)}
                        />
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredRateCards.map((rateCard) => (
                          <div
                            key={rateCard.id}
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                underRateCard: rateCard.id,
                              }));
                              setSearchRateCard('');
                              setIsRateCardDropdownOpen(false);
                            }}
                            className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                          >
                            {rateCard.card_name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Unit:</label>
              <SelectWithIcon
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
              >
                <option value="">Select</option>
                {units && units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
              </SelectWithIcon>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Rate:</label>
              <input
                type="number"
                name="rate"
                value={formData.rate}
                onChange={handleInputChange}
                className="w-full pl-3 pr-3 py-2 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                placeholder="Rate"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Opex or Capex:
              </label>
              <SelectWithIcon
                name="opexCapex"
                value={formData.opexCapex}
                onChange={handleInputChange}
              >
                <option value="">Select</option>
                <option value="opex">OPEX</option>
                <option value="capex">CAPEX</option>
              </SelectWithIcon>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Material:
              </label>
              <SelectWithIcon
                name="material"
                value={formData.material}
                onChange={handleInputChange}
              >
                <option value="">Select</option>
                <option value="applicable">Applicable</option>
                <option value="not_applicable">Not Applicable</option>
              </SelectWithIcon>
            </div>

            <div className="col-span-1 md:col-span-2">
              {formData.material === 'applicable' && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Added Materials:
                  </h3>
                  {formData.materials.map((material, index) => (
                    <div
                      key={index}
                      className="relative grid grid-cols-1 md:grid-cols-2 gap-4 items-center px-6 py-10 rounded-lg shadow-sm"
                    >
                      <button
                        type="button"
                        onClick={() => removeMaterial(index)}
                        className="absolute top-4 right-5 text-[0.8rem] text-white transition-colors flex items-center border-[1px] border-red-500 rounded-full px-[5px] py-[1px] bg-red-500"
                      >
                        <MdOutlineRemoveCircleOutline />{' '}
                        <span className="mx-1">Remove</span>
                      </button>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Material Name:
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={material.name}
                          onChange={(e) => handleMaterialChange(index, e)}
                          className="w-full pl-3 pr-3 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Material Name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Under:
                        </label>
                        <SelectWithIcon
                          name="under"
                          value={material.under}
                          onChange={(e) => handleMaterialChange(index, e)}
                        >
                          <option value="">Select</option>
                          <option value="civil">Civil</option>
                          <option value="electrical">Electrical</option>
                          <option value="plumbing">Plumbing</option>
                        </SelectWithIcon>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Unit:
                        </label>
                        <SelectWithIcon
                          name="unit"
                          value={material.unit}
                          onChange={(e) => handleMaterialChange(index, e)}
                        >
                          <option value="">Select</option>
                          {units.map((unit) => (
                            <option key={unit.id} value={unit.id}>
                              {unit.name}
                            </option>
                          ))}
                        </SelectWithIcon>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Quantity:
                        </label>
                        <input
                          type="number"
                          name="quantity"
                          value={material.quantity}
                          onChange={(e) => handleMaterialChange(index, e)}
                          className="w-full pl-3 pr-3 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Quantity"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addMaterial}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    <IoMdAdd />
                    Add Material
                  </button>
                </div>
              )}
            </div>

            <div className="col-span-1 md:col-span-2 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg border border-gray-500 text-gray-500 hover:bg-gray-50 transition-colors duration-300 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300 text-sm sm:text-base"
              >
                Submit
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddRateCardItemModal;
