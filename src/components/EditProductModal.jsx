import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAlert } from '../contexts/AlertContext';

export const EditProductModal = ({ product, onClose, onUpdate }) => {
  const { showAlert } = useAlert();
  const [formData, setFormData] = useState({
    name: product.name,
    lowestPrice: product.lowestPrice.toLocaleString(),
    highestPrice: product.highestPrice.toLocaleString(),
    type: product.type || 'Boshqa',
    image: product.image,
    imageMethod: 'url'
  });
  const [imagePreview, setImagePreview] = useState(product.image);
  const [imageError, setImageError] = useState(false);

  const productTypes = {
    'Oziq-ovqat': 'Food',
    'Texnologiya': 'Technology',
    'Kiyim': 'Clothing',
    'Salomatlik': 'Health',
    'Uy-ro\'zg\'or': 'Home',
    'Go\'zallik': 'Beauty',
    'Sport': 'Sports',
    'Kitoblar': 'Books',
    'O\'yinchoqlar': 'Toys',
    'Transport': 'Transport',
    'Boshqa': 'Other'
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imageMethod') {
      setFormData(prev => ({
        ...prev,
        imageMethod: value,
        image: value === 'url' ? product.image : null
      }));
      setImagePreview(value === 'url' ? product.image : '');
      setImageError(false);
    } else if (name === 'image') {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
          setImageError(false);
        };
        reader.readAsDataURL(file);
        setFormData(prev => ({ ...prev, image: file }));
      }
    } else if (name === 'imageUrl') {
      setFormData(prev => ({ ...prev, image: value }));
      setImagePreview(value);
      setImageError(false);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageError = () => {
    setImageError(true);
    setImagePreview('/src/assets/main.png');
  };

  const handleCancelImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null,
      imageUrl: '',
      imageMethod: 'url'
    }));
    setImagePreview('');
    setImageError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const productRef = doc(db, 'products', product.id);
      await updateDoc(productRef, {
        ...formData,
        lowestPrice: parseFloat(formData.lowestPrice.replace(/,/g, '')),
        highestPrice: parseFloat(formData.highestPrice.replace(/,/g, '')),
        image: formData.image
      });
      onUpdate(formData);
      showAlert(`"${formData.name}" mahsuloti yangilandi`, 'success');
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
      showAlert('Mahsulotni yangilashda xatolik yuz berdi', 'error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-dark-800 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-dark-700 pb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Mahsulotni tahrirlash</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Mahsulot nomi
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg 
                text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                bg-white dark:bg-dark-700
                focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 
                focus:border-primary-500 dark:focus:border-primary-400"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Mahsulot turi
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg 
                text-gray-900 dark:text-white 
                bg-white dark:bg-dark-700
                focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 
                focus:border-primary-500 dark:focus:border-primary-400"
              required
            >
              <option value="">Turni tanlang</option>
              {Object.entries(productTypes).map(([uzName, engValue]) => (
                <option key={engValue} value={engValue}>
                  {uzName}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Eng arzon narx
              </label>
              <input
                type="text"
                name="lowestPrice"
                value={formData.lowestPrice}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg 
                  text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                  bg-white dark:bg-dark-700
                  focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 
                  focus:border-primary-500 dark:focus:border-primary-400"
                required
                pattern="[0-9,]*"
                placeholder="1,000,000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Eng qimmat narx
              </label>
              <input
                type="text"
                name="highestPrice"
                value={formData.highestPrice}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg 
                  text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                  bg-white dark:bg-dark-700
                  focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 
                  focus:border-primary-500 dark:focus:border-primary-400"
                required
                pattern="[0-9,]*"
                placeholder="1,500,000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Rasm qo'shish usuli
            </label>
            <div className="flex gap-4 mb-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="imageMethod"
                  value="url"
                  checked={formData.imageMethod === 'url'}
                  onChange={handleChange}
                  className="mr-2 text-primary-500 dark:text-primary-400 border-gray-300 dark:border-dark-600"
                />
                <span className="text-gray-700 dark:text-gray-200">URL orqali</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="imageMethod"
                  value="file"
                  checked={formData.imageMethod === 'file'}
                  onChange={handleChange}
                  className="mr-2 text-primary-500 dark:text-primary-400 border-gray-300 dark:border-dark-600"
                />
                <span className="text-gray-700 dark:text-gray-200">Fayl yuklash</span>
              </label>
            </div>

            {formData.imageMethod === 'url' ? (
              <input
                type="url"
                name="imageUrl"
                value={formData.image}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg 
                  text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                  bg-white dark:bg-dark-700
                  focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 
                  focus:border-primary-500 dark:focus:border-primary-400"
                placeholder="Rasm URL manzilini kiriting"
              />
            ) : (
              <input
                type="file"
                name="image"
                onChange={handleChange}
                accept="image/*"
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg 
                  text-gray-900 dark:text-white
                  bg-white dark:bg-dark-700
                  focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 
                  focus:border-primary-500 dark:focus:border-primary-400"
              />
            )}
          </div>

          {imagePreview && !imageError && (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                onError={handleImageError}
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={handleCancelImage}
                className="absolute top-2 right-2 bg-white dark:bg-dark-800 text-gray-600 dark:text-gray-300 p-1 rounded-full 
                  hover:bg-gray-100 dark:hover:bg-dark-700"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 
                bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 
                rounded-lg hover:bg-gray-50 dark:hover:bg-dark-600"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-500 
                rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 
                focus:ring-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Saqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
