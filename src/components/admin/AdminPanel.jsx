import React, { useState } from 'react';
import AdminProductForm from './AdminProductForm';

const AdminPanel = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <AdminProductForm onClose={onClose} />
    </div>
  );
};

export default AdminPanel;
