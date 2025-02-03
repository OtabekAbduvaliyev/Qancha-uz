import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './auth/AuthModal';

const SearchBar = ({ onSearch, initialValue = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue.trim());
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [lastSearchClick, setLastSearchClick] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { user } = useAuth();
  const DOUBLE_CLICK_DELAY = 300;

  useEffect(() => {
    setSearchTerm(initialValue.trim());
  }, [initialValue]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, onSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
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
    <div className="max-w-[1200px] mx-auto px-6 relative z-40">
      <form onSubmit={handleSubmit} className="relative group">
        <div className={`relative flex items-center transition-all duration-200 ${isFocused ? 'scale-[1.02]' : ''}`}>
          <input
            type="text"
            value={searchTerm}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Mahsulot nomini kiriting..."
            className="w-full h-14 pl-14 pr-14 text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 
              bg-white dark:bg-dark-800 rounded-2xl border-2 border-transparent dark:border-dark-700
              focus:border-primary-500 dark:focus:border-primary-400 
              focus:outline-none focus:ring-4 focus:ring-primary-500/20 dark:focus:ring-primary-400/20
              transition-all duration-200"
          />
          <div className="absolute left-5 top-1/2 -translate-y-1/2">
            <svg
              onClick={handleSearchIconClick}
              className="w-5 h-5 text-gray-400 dark:text-gray-500 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-5 top-1/2 -translate-y-1/2 p-1 rounded-full 
                text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300
                hover:bg-gray-100 dark:hover:bg-dark-700 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </form>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

export default SearchBar;
