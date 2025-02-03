import React, { useState } from 'react';
import { db } from '../../firebase';
import { supabase } from '../../supabase';
import { collection, addDoc } from 'firebase/firestore';
import { useAlert } from '../../contexts/AlertContext';

const AdminProductForm = ({ onClose }) => {
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    lowestPrice: '',
    highestPrice: '',
    type: '',
    image: null,
    imageUrl: '',
    imageMethod: 'url', // Default to URL method
    isSellerAvailable: false,
    phoneNumber: '',
    views: 0
  });

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
    const { name, value, files, type } = e.target;
    if (name === 'imageMethod') {
      setFormData(prev => ({
        ...prev,
        imageMethod: value,
        // Clear both image fields when switching methods
        image: null,
        imageUrl: '',
      }));
      setImagePreview('');
    } else if (name === 'image') {
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        image: file,
        imageUrl: '' // Clear imageUrl when file is selected
      }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
          setImageError(false);
        };
        reader.readAsDataURL(file);
      }
    } else if (name === 'imageUrl') {
      setFormData(prev => ({
        ...prev,
        imageUrl: value,
        image: null // Clear file when URL is entered
      }));
      if (value) {
        setImagePreview(value);
        setImageError(false);
      } else {
        setImagePreview('');
      }
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

  const uploadImage = async (file) => {
    try {
      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2);
      const fileName = `${uniqueId}.${fileExt}`;
      const filePath = `products/${fileName}`;

      // Create file object with proper content type
      const fileOptions = {
        cacheControl: '3600',
        contentType: file.type
      };

      // Upload the file to Supabase storage
      const { error: uploadError, data } = await supabase.storage
        .from('qancha-products')
        .upload(filePath, file, fileOptions);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('qancha-products')
        .getPublicUrl(filePath);

      if (!publicUrl) {
        throw new Error('Failed to get public URL');
      }

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
      let imageUrl = formData.imageUrl;
      
      // Upload image if file is selected
      if (formData.image) {
        imageUrl = await uploadImage(formData.image);
      }

      // Add product to Firestore
      const productData = {
        name: formData.name,
        lowestPrice: parseFloat(formData.lowestPrice),
        highestPrice: parseFloat(formData.highestPrice),
        type: formData.type,
        image: imageUrl,
        isSellerAvailable: formData.isSellerAvailable,
        phoneNumber: formData.isSellerAvailable ? formData.phoneNumber : '',
        createdAt: new Date().toISOString(),
        views: 0,
        forwards: 0
      };

      const docRef = await addDoc(collection(db, 'products'), productData);

      showAlert(`"${formData.name}" mahsuloti qo'shildi`, 'success');
      onClose();
    } catch (err) {
      console.error('Error adding product:', err);
      showAlert('Mahsulot qo\'shishda xatolik yuz berdi', 'error');
      setError('Mahsulot qo\'shishda xatolik: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-dark-800 rounded-lg shadow-xl w-full max-w-md m-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-dark-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Yangi mahsulot qo'shish</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(100vh-16rem)]">
          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

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
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg 
                  text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                  bg-white dark:bg-dark-700
                  focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 
                  focus:border-primary-500 dark:focus:border-primary-400"
                placeholder="Mahsulot nomini kiriting"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Eng arzon narx
                </label>
                <input
                  type="number"
                  name="lowestPrice"
                  value={formData.lowestPrice}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg 
                    text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                    bg-white dark:bg-dark-700
                    focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 
                    focus:border-primary-500 dark:focus:border-primary-400"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Eng qimmat narx
                </label>
                <input
                  type="number"
                  name="highestPrice"
                  value={formData.highestPrice}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg 
                    text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                    bg-white dark:bg-dark-700
                    focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 
                    focus:border-primary-500 dark:focus:border-primary-400"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Mahsulot turi
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg 
                  text-gray-900 dark:text-white 
                  bg-white dark:bg-dark-700
                  focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 
                  focus:border-primary-500 dark:focus:border-primary-400"
              >
                <option value="">Tanlang</option>
                {Object.entries(productTypes).map(([key]) => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
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
                    className="mr-2"
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
                    className="mr-2"
                  />
                  <span className="text-gray-700 dark:text-gray-200">Fayl yuklash</span>
                </label>
              </div>

              {formData.imageMethod === 'url' ? (
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
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

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                name="isSellerAvailable"
                checked={formData.isSellerAvailable}
                onChange={(e) => setFormData(prev => ({ ...prev, isSellerAvailable: e.target.checked }))}
                className="h-4 w-4 text-primary-500 dark:text-primary-400 border-gray-300 dark:border-dark-600 rounded"
              />
              <label className="ml-2 text-sm text-gray-700 dark:text-gray-200">
                Sotuvchi bilan bog'lanish mumkin
              </label>
            </div>

            {formData.isSellerAvailable && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Telefon raqam
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg 
                    text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                    bg-white dark:bg-dark-700
                    focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 
                    focus:border-primary-500 dark:focus:border-primary-400"
                  placeholder="+998 90 123 45 67"
                />
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
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-500 
                  rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 
                  focus:ring-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Yuklanmoqda...' : 'Qo\'shish'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProductForm;
