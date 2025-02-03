import React from 'react';
import { useAlert } from '../contexts/AlertContext';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, productName }) => {
  const { showAlert } = useAlert();

  const handleDelete = () => {
    onConfirm();
    showAlert(`"${productName}" mahsuloti o'chirildi`, 'success');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 max-w-sm w-full transform transition-all duration-200 ease-out">
        <div className="flex flex-col items-center text-center">
          <div className="mx-auto flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <svg className="h-8 w-8 text-red-600 dark:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Mahsulotni o'chirish
          </h2>
          
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Siz rostdan ham <span className="font-medium text-gray-900 dark:text-white">"{productName}"</span> mahsulotini o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={onClose}
              className="w-full sm:w-1/2 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 
                bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 
                rounded-xl hover:bg-gray-50 dark:hover:bg-dark-600 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 
                dark:focus:ring-offset-dark-800 transition-colors"
            >
              Bekor qilish
            </button>
            <button
              onClick={handleDelete}
              className="w-full sm:w-1/2 px-4 py-3 text-sm font-medium text-white 
                bg-red-600 dark:bg-red-500 rounded-xl hover:bg-red-700 dark:hover:bg-red-600 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 
                dark:focus:ring-offset-dark-800 transition-colors"
            >
              O'chirish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
