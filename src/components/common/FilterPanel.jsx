import { useState } from 'react';
import { FaFilter, FaTimes, FaChevronDown } from 'react-icons/fa';

const FilterPanel = ({ 
  filters = [], 
  onFilterChange, 
  onClear,
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeFilters, setActiveFilters] = useState({});

  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...activeFilters, [filterKey]: value };
    setActiveFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleClearAll = () => {
    setActiveFilters({});
    if (onClear) {
      onClear();
    }
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).filter(v => v !== '' && v !== null && v !== undefined).length;
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg ₹{className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <FaFilter className="text-purple-600" />
          <h3 className="font-semibold text-gray-800 dark:text-white">Filters</h3>
          {getActiveFilterCount() > 0 && (
            <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 text-xs rounded-full">
              {getActiveFilterCount()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {getActiveFilterCount() > 0 && (
            <button
              onClick={handleClearAll}
              className="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            <FaChevronDown className={`transition-transform ₹{isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Options */}
      {isOpen && (
        <div className="p-4 space-y-4">
          {filters.map((filter, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {filter.label}
              </label>
              
              {filter.type === 'select' && (
                <select
                  value={activeFilters[filter.key] || ''}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:border-purple-500 focus:outline-none"
                >
                  <option value="">All {filter.label}</option>
                  {filter.options.map((option, i) => (
                    <option key={i} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}

              {filter.type === 'checkbox' && (
                <div className="space-y-2">
                  {filter.options.map((option, i) => (
                    <label key={i} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={activeFilters[filter.key]?.includes(option.value) || false}
                        onChange={(e) => {
                          const current = activeFilters[filter.key] || [];
                          const newValue = e.target.checked
                            ? [...current, option.value]
                            : current.filter(v => v !== option.value);
                          handleFilterChange(filter.key, newValue);
                        }}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              {filter.type === 'range' && (
                <div className="space-y-2">
                  <input
                    type="range"
                    min={filter.min}
                    max={filter.max}
                    step={filter.step || 1}
                    value={activeFilters[filter.key] || filter.min}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>{filter.min}</span>
                    <span className="font-semibold text-purple-600">
                      {activeFilters[filter.key] || filter.min}
                    </span>
                    <span>{filter.max}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
