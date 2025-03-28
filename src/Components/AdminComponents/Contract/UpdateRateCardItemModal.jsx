import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { IoIosArrowDown } from 'react-icons/io';
import './UpdateRateCardItemModal.css';
import { AdminApi } from '../../../services/AdminApi';

const UpdateRateCardItemModal = ({ isOpen, onClose, rateCard, onUpdate }) => {
  const [rateCards, setRateCards] = useState([]);
  const [units, setUnits] = useState([]);
  const [searchRateCard, setSearchRateCard] = useState('');
  const [isRateCardDropdownOpen, setIsRateCardDropdownOpen] = useState(false);

  const [formData, setFormData] = useState({
    itemName: '',
    unit: '',
    opexCapex: '',
    workType: '',
    material: '',
    underRateCard: '',
    rate: '',
    flatType: '',
    materialName: '',
    materialUnder: '',
    materialUnit: '',
    materialQuantity: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rateCardsResponse, unitsResponse] = await Promise.all([
          AdminApi.listRateCards(),
          AdminApi.listUnits(),
        ]);
        setRateCards(rateCardsResponse.data || []);
        setUnits(unitsResponse.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (rateCard) {
      setFormData({
        itemName: rateCard.item_name || '',
        unit: rateCard.unit || '',
        opexCapex: rateCard.opex_or_capex?.toLowerCase() || '',
        workType: rateCard.work_type || '',
        material:
          rateCard.material?.toLowerCase() === 'applicable'
            ? 'applicable'
            : 'not_applicable',
        underRateCard: rateCard.rate_card || '',
        rate: rateCard.rate || '',
        flatType: rateCard.flat_type || '',
        materialName: rateCard.material_name || '',
        materialUnder: rateCard.material_under || '',
        materialUnit: rateCard.material_unit || '',
        materialQuantity: rateCard.material_quantity || '',
      });
    }
  }, [rateCard]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        rate_card: formData.underRateCard,
        companyid: 1,
        item_name: formData.itemName,
        unit: parseInt(formData.unit),
        rate: parseFloat(formData.rate),
        opex_or_capex: formData.opexCapex === 'opex' ? 'Opex' : 'Capex',
        material:
          formData.material === 'applicable' ? 'Applicable' : 'Not Applicable',
      };

      await AdminApi.editRateCardItem(rateCard.id, payload);
      onUpdate?.();
      onClose();
    } catch (error) {
      console.error('Error updating rate card item:', error);
    }
  };

  const filteredRateCards = rateCards.filter(
    (card) =>
      card.card_name &&
      card.card_name.toLowerCase().includes(searchRateCard.toLowerCase())
  );

  const toggleRateCardDropdown = () => {
    setIsRateCardDropdownOpen(!isRateCardDropdownOpen);
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md h-[80vh] overflow-y-scroll scrollbar-hide"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Update Rate Card
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <IoClose size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Item Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Item Name:
                </label>
                <input
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Under Rate Card */}
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
                        (card) => card.id === formData.underRateCard
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
                        {filteredRateCards.map((card) => (
                          <div
                            key={card.id}
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                underRateCard: card.id,
                              }));
                              setSearchRateCard('');
                              setIsRateCardDropdownOpen(false);
                            }}
                            className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                          >
                            {card.card_name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Unit */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Unit:
                </label>
                <SelectWithIcon
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name}
                    </option>
                  ))}
                </SelectWithIcon>
              </div>

              {/* Rate */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Rate:
                </label>
                <input
                  type="number"
                  name="rate"
                  value={formData.rate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Opex or Capex */}
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


              {/* Material */}
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

              {formData.material === 'applicable' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Material Name:
                    </label>
                    <input
                      type="text"
                      name="materialName"
                      value={formData.materialName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Under:
                    </label>
                    <SelectWithIcon
                      name="materialUnder"
                      value={formData.materialUnder}
                      onChange={handleInputChange}
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
                      name="materialUnit"
                      value={formData.materialUnit}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      <option value="sqft">Square Feet</option>
                      <option value="sqm">Square Meter</option>
                      <option value="unit">Unit</option>
                      <option value="rm">Running Meter</option>
                    </SelectWithIcon>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Quantity:
                    </label>
                    <input
                      type="number"
                      name="materialQuantity"
                      value={formData.materialQuantity}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Update
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UpdateRateCardItemModal;
