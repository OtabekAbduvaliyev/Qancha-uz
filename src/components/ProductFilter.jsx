import React from 'react';

const ProductFilter = ({ selectedType, onTypeChange, productTypes }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
      <button
        onClick={() => onTypeChange(null)}
        className={`px-4 py-2 text-sm rounded-xl transition-all whitespace-nowrap
          ${!selectedType 
            ? 'bg-gray-900 text-white' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
      >
        Barcha mahsulotlar
      </button>
      {productTypes.map((type) => (
        <button
          key={type.en}
          onClick={() => onTypeChange(type)}
          className={`px-4 py-2 text-sm rounded-xl transition-all whitespace-nowrap
            ${(selectedType && selectedType.en === type.en)
              ? 'bg-gray-900 text-white' 
              : 'bg-gray-200 text-gray-600 hover:bg-gray-200 border-none'
            }`}
        >
          <span className="font-medium">{type.uz}</span>
        </button>
      ))}
    </div>
  );
};

export default ProductFilter;
