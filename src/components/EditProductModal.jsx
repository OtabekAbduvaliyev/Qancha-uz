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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Mahsulotni tahrirlash</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mahsulot nomi
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mahsulot turi
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Eng past narx (so'm)
            </label>
            <input
              type="text"
              name="lowestPrice"
              value={formData.lowestPrice}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              pattern="[0-9,]*"
              placeholder="Masalan: 1,000,000"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Eng yuqori narx (so'm)
            </label>
            <input
              type="text"
              name="highestPrice"
              value={formData.highestPrice}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              pattern="[0-9,]*"
              placeholder="Masalan: 1,500,000"
            />
          </div>

          <div className="space-y-4">
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="imageMethod"
                  value="url"
                  checked={formData.imageMethod === 'url'}
                  onChange={handleChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Havola orqali</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="imageMethod"
                  value="file"
                  checked={formData.imageMethod === 'file'}
                  onChange={handleChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Fayl yuklash</span>
              </label>
            </div>

            {formData.imageMethod === 'url' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rasm havolasi
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rasm yuklash
                </label>
                <div className="relative">
                  <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                    accept="image/*"
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                  >
                    <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Rasm tanlash
                  </label>
                </div>
              </div>
            )}

            {/* Image Preview */}
            {(imagePreview || formData.image) && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Rasm ko'rinishi
                  </label>
                  <button
                    type="button"
                    onClick={handleCancelImage}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    title="Rasmni o'chirish"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                  {imageError ? (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                      <span>Noto'g'ri rasm havolasi</span>
                    </div>
                  ) : (
                    <img
                      src={imagePreview || formData.image}
                      alt="Mahsulot ko'rinishi"
                      onError={handleImageError}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Saqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
