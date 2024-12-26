import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const ProductCard = ({ product, onEdit }) => {
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.email === 'otabekabduvaliyev1910@gmail.com'; // Replace with your admin email

  useEffect(() => {
    const likedProducts = JSON.parse(localStorage.getItem('likedProducts') || '[]');
    setIsLiked(likedProducts.includes(product.id));
  }, [product.id]);

  const handleLike = () => {
    const likedProducts = JSON.parse(localStorage.getItem('likedProducts') || '[]');
    let newLikedProducts;

    if (isLiked) {
      newLikedProducts = likedProducts.filter(id => id !== product.id);
    } else {
      newLikedProducts = [...likedProducts, product.id];
    }

    localStorage.setItem('likedProducts', JSON.stringify(newLikedProducts));
    setIsLiked(!isLiked);
  };

  const handleDelete = async () => {
    if (!isAdmin) return;
    
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', product.id));
        // You might want to trigger a refresh of the products list here
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative group">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <button
          onClick={handleLike}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
        >
          <svg
            className={`w-5 h-5 ${isLiked ? 'text-red-500' : 'text-gray-400'} transition-colors`}
            fill={isLiked ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">{product.name}</h3>
        
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-medium text-gray-900">{product.lowestPrice}</span>
            <span className="text-sm text-gray-500">-</span>
            <span className="text-lg font-medium text-gray-900">{product.highestPrice}</span>
            <span className="text-sm text-gray-500">UZS</span>
          </div>

          {isAdmin && (
            <div className="flex items-center gap-2 py-2 border-t border-gray-100">
              <button
                onClick={() => onEdit(product)}
                className="flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
            <button
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
              onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent('https://qancha-uz.vercel.app' + window.location.pathname)}&text=${encodeURIComponent(`Check out ${product.name} on Qancha.uz!`)}`, '_blank')}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.53-1.4.51-.46-.01-1.35-.26-2.01-.48-.81-.27-1.46-.42-1.4-.88.03-.24.37-.49 1.03-.74 4.03-1.75 6.72-2.91 8.07-3.48 3.85-1.63 4.64-1.91 5.17-1.92.11 0 .37.03.54.18.17.15.21.36.23.47-.01.06.01.24-.01.38z"/>
              </svg>
              Share
            </button>
            <button
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
              onClick={() => {
                navigator.clipboard.writeText('https://qancha-uz.vercel.app' + window.location.pathname);
                // You could add a toast notification here
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
