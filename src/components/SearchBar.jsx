import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './auth/AuthModal';

const SearchBar = ({ onSearch, initialValue = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [lastSearchClick, setLastSearchClick] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();
  const DOUBLE_CLICK_DELAY = 300;

  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm.trim());
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Trigger search after a short delay as user types
    const timeoutId = setTimeout(() => {
      onSearch(value.trim());
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleSearchIconClick = (e) => {
    e.preventDefault();
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - lastSearchClick;
    
    if (timeDiff < DOUBLE_CLICK_DELAY && !user) {
      setIsAuthModalOpen(true);
    }
    
    setLastSearchClick(currentTime);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder="Search products..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-shadow"
        />
        <button
          type="submit"
          onClick={handleSearchIconClick}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </form>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default SearchBar;
