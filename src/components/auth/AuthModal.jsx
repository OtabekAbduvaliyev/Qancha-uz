import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg hover:bg-gray-100"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="flex border-b">
            <button
              className={`flex-1 py-3 px-6 text-sm font-medium ${
                isLogin ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`flex-1 py-3 px-6 text-sm font-medium ${
                !isLogin ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>
          
          <div className="p-6">
            {isLogin ? (
              <Login onClose={onClose} />
            ) : (
              <Signup onClose={onClose} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
