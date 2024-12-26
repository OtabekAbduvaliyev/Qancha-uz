import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value); // Search as user types
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder="Search products..."
          className="w-full p-3 pl-4 pr-20 rounded-lg bg-white border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors text-base"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors text-sm font-medium"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
