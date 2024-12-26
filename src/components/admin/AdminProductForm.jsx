import React, { useState } from 'react';
import { db } from '../../firebase';
import { supabase } from '../../supabase';
import { collection, addDoc } from 'firebase/firestore';

const AdminProductForm = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    lowestPrice: '',
    highestPrice: '',
    image: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData(prev => ({
        ...prev,
        image: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const uploadImage = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('qancha-products')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = await supabase.storage
        .from('qancha-products')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let imageUrl = '';
      
      // Upload image if selected
      if (formData.image) {
        imageUrl = await uploadImage(formData.image);
      }

      // Add product to Firestore
      await addDoc(collection(db, 'products'), {
        name: formData.name,
        lowestPrice: parseFloat(formData.lowestPrice.replace(/,/g, '')),
        highestPrice: parseFloat(formData.highestPrice.replace(/,/g, '')),
        image: imageUrl,
        createdAt: new Date().toISOString()
      });

      onClose();
    } catch (err) {
      setError('Failed to add product: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lowest Price (UZS)
          </label>
          <input
            type="text"
            name="lowestPrice"
            value={formData.lowestPrice}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
            pattern="[0-9,]*"
            placeholder="e.g., 1,000,000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Highest Price (UZS)
          </label>
          <input
            type="text"
            name="highestPrice"
            value={formData.highestPrice}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
            pattern="[0-9,]*"
            placeholder="e.g., 1,500,000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Image
          </label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AdminProductForm;
