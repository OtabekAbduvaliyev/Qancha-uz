import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './auth/AuthModal';
import AdminPanel from './admin/AdminPanel';

const ADMIN_EMAIL = 'otabekabduvaliyev1910@gmail.com';

const Navbar = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [showLoginButton, setShowLoginButton] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const userMenuRef = useRef(null);

  const isAdmin = user?.email === ADMIN_EMAIL;

  const [lastQPress, setLastQPress] = useState(0);
  const DOUBLE_PRESS_DELAY = 300;

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key.toLowerCase() === 'q' && !user) {
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastQPress;
        
        if (timeDiff < DOUBLE_PRESS_DELAY) {
          setShowLoginButton(true);
        }
        
        setLastQPress(currentTime);
      }
    };

    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [lastQPress, user]);

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
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 fixed w-full top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex justify-between h-14">
            <div className="flex items-center">
              <span className="text-lg font-medium text-gray-900">Qancha.uz</span>
            </div>

            <div className="flex items-center">
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="group flex items-center gap-2 hover:bg-gray-50/80 pl-3 pr-2 py-1.5 rounded-xl transition-all"
                  >
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                      {formatEmail(user.email)}
                    </span>
                    <div className="w-7 h-7 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white text-sm font-medium">
                        {formatEmail(user.email).charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg py-1.5 border border-gray-100 transform opacity-100 scale-100 transition-all duration-200">
                      {isAdmin && (
                        <button
                          onClick={() => {
                            setIsAdminPanelOpen(true);
                            setShowUserMenu(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Mahsulot qo'shish
                        </button>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
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
                    className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 px-4 py-1.5 rounded-full transition-all"
                  >
                    Kirish
                  </button>
                  <button
                    onClick={() => setShowLoginButton(false)}
                    className="ml-1 p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50/80 transition-all"
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

      <div className="h-14"></div>

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
