import React, { useState, useEffect, useRef } from 'react';
import { IoIosArrowDown, IoIosSearch } from 'react-icons/io';

const SearchableDropdown = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  isLoading = false,
  label,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState('bottom');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const updateDropdownPosition = () => {
      if (dropdownRef.current && isOpen) {
        const rect = dropdownRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const dropdownHeight = 300; // Approximate max height of dropdown

        setDropdownPosition(
          spaceBelow < dropdownHeight && spaceAbove > spaceBelow
            ? 'top'
            : 'bottom'
        );
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('scroll', updateDropdownPosition);
    window.addEventListener('resize', updateDropdownPosition);

    if (isOpen) {
      updateDropdownPosition();
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', updateDropdownPosition);
      window.removeEventListener('resize', updateDropdownPosition);
    };
  }, [isOpen]);

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  const getDisplayValue = () => {
    if (!value) return placeholder;
    const selected = options.find((option) => option.id === value);
    return selected ? selected.name : placeholder;
  };

  return (
    <div className="block relative" ref={dropdownRef}>
      {label && (
        <span className="text-sm font-medium text-gray-700 block mb-1">
          {label}
        </span>
      )}
      <div className="relative">
        <button
          type="button"
          className={`w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-left focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between ${
            disabled ? 'bg-gray-50 cursor-not-allowed' : ''
          }`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled || isLoading}
        >
          <span className="block truncate">
            {isLoading ? 'Loading...' : getDisplayValue()}
          </span>
          <IoIosArrowDown
            className={`ml-2 h-5 w-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div
            className={`absolute ${
              dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'
            } left-0 z-50 w-full bg-white border border-gray-300 rounded-md shadow-lg`}
            style={{ maxHeight: '300px' }}
          >
            <div className="sticky top-0 bg-white p-2 border-b z-10">
              <div className="relative">
                <IoIosSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: '250px' }}>
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-2 text-gray-500">No options found</div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                    onClick={() => handleSelect(option)}
                  >
                    {option.name}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchableDropdown;
