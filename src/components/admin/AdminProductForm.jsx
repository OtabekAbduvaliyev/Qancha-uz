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
        lowestPrice: parseFloat(formData.lowestPrice.replace(/,/g, '')),
        highestPrice: parseFloat(formData.highestPrice.replace(/,/g, '')),
        type: formData.type || 'Other',
        image: imageUrl,
        isSellerAvailable: formData.isSellerAvailable,
        phoneNumber: formData.isSellerAvailable ? formData.phoneNumber : '',
        createdAt: new Date().toISOString(),
        views: 0
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
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md m-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Yangi mahsulot qo'shish</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(100vh-16rem)]">
          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

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
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
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
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
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
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
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
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                required
                pattern="[0-9,]*"
                placeholder="Masalan: 1,500,000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sotuvchi mavjudmi?
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="isSellerAvailable"
                    checked={!formData.isSellerAvailable}
                    onChange={() => setFormData(prev => ({ ...prev, isSellerAvailable: false, phoneNumber: '' }))}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Yo'q</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="isSellerAvailable"
                    checked={formData.isSellerAvailable}
                    onChange={() => setFormData(prev => ({ ...prev, isSellerAvailable: true }))}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Ha</span>
                </label>
              </div>
            </div>

            {formData.isSellerAvailable && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon raqami
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="+998 90 123 45 67"
                  required={formData.isSellerAvailable}
                />
              </div>
            )}

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
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                    required={formData.imageMethod === 'url'}
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
                      id="file-upload-add"
                      required={formData.imageMethod === 'file'}
                    />
                    <label
                      htmlFor="file-upload-add"
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
              {(imagePreview || formData.imageUrl) && (
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
                        src={imagePreview || formData.imageUrl}
                        alt="Mahsulot ko'rinishi"
                        onError={handleImageError}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="p-6 border-t bg-gray-50">
          <button
            type="submit"
            disabled={loading || (formData.imageMethod === 'url' ? !formData.imageUrl : !formData.image) || (formData.isSellerAvailable && !formData.phoneNumber)}
            className="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800 transition-colors disabled:opacity-50"
            onClick={handleSubmit}
          >
            {loading ? 'Qo\'shilmoqda...' : 'Mahsulotni qo\'shish'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProductForm;
