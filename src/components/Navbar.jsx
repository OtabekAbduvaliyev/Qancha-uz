import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './auth/AuthModal';
import AdminPanel from './admin/AdminPanel';
import { Link } from 'react-router-dom';

const ADMIN_EMAIL = 'otabekabduvaliyev1910@gmail.com';

const Navbar = ({ isDark, setIsDark }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [showLoginButton, setShowLoginButton] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const userMenuRef = useRef(null);

  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setShowLoginButton(false);
      setShowUserMenu(false);
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const formatEmail = (email) => {
    const [username] = email.split('@');
    return username;
  };

  return (
    <>
      <nav className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 transition-colors duration-200 relative z-50">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex justify-between h-14">
            <div className="flex items-center">
              <Link to="/" className="text-lg font-medium text-gray-900 dark:text-gray-200 hover:text-gray-700 dark:hover:text-gray-400 transition-colors">
                Qancha.uz
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsDark(!isDark)}
                className="bg-transparent dark:bg-dark-700 hover:bg-gray-100 dark:hover:bg-dark-600 p-2 rounded-xl text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-all focus:outline-none"
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`group flex items-center gap-2 bg-transparent dark:bg-dark-700 hover:bg-gray-100 dark:hover:bg-dark-600 pl-3 pr-2 py-1.5 rounded-xl transition-all ${showUserMenu ? 'bg-gray-100 dark:bg-dark-600' : ''}`}
                  >
                    <div className="w-7 h-7 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white text-sm font-medium">
                        {user?.email ? user.email.charAt(0).toUpperCase() : '?'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                      {user?.email ? user.email.split('@')[0] : 'User'}
                    </span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-dark-700 rounded-xl shadow-lg border border-gray-100 dark:border-dark-600 transform opacity-100 scale-100 transition-all duration-200 z-50">
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => {
                              setIsAdminPanelOpen(true);
                              setShowUserMenu(false);
                            }}
                            className={`flex items-center w-full px-4 py-2.5 text-sm text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors rounded-t-xl ${!isAdminPanelOpen ? 'bg-gray-100 dark:bg-dark-600' : ''}`}
                          >
                            <svg className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Mahsulot qo'shish
                          </button>
                          <Link
                            to="/bulk-upload"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center w-full px-4 py-2.5 text-sm text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Ommaviy yuklash
                          </Link>
                        </>
                      )}
                      <button
                        onClick={handleLogout}
                        className={`flex items-center w-full px-4 py-2.5 text-sm text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors bg ${isAdmin ? '' : 'rounded-t-xl'} rounded-b-xl ${!isAdminPanelOpen ? 'bg-gray-100 dark:bg-dark-600' : ''}` }
                      >
                        <svg className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0-4l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Chiqish
                      </button>
                    </div>
                  )}
                </div>
              ) : showLoginButton ? (
                <div className="flex items-center">
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50/80 dark:hover:bg-dark-800 transition-colors"
                  >
                    Kirish
                  </button>
                  <button
                    onClick={() => setShowLoginButton(false)}
                    className="ml-1 p-1.5 text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 rounded-full hover:bg-gray-50/80 dark:hover:bg-dark-800 transition-all"
                    aria-label="Close"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </nav>

      <div className="h-4"></div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
      />
    </>
  );
};

export default Navbar;
