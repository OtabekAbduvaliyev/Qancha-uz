import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { deleteDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { useNavigate } from 'react-router-dom';

const ProductCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-dark-700" />
      <div className="p-4">
        <div className="h-6 bg-gray-200 dark:bg-dark-700 rounded w-3/4 mb-2" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-1/2" />
          <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product, onEdit, loading }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [loadingState, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.email === 'otabekabduvaliyev1910@gmail.com';
  const navigate = useNavigate();

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
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'products', product.id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
    setLoading(false);
    setShowDeleteModal(false);
  };

  if (loading) return <ProductCardSkeleton />;

  return (
    <>
      <div className="group bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 overflow-hidden transition-all hover:shadow-md">
        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden">
            <div className="absolute inset-0 bg-black/5 dark:bg-black/40 group-hover:bg-black/10 dark:group-hover:bg-black/50 transition-colors z-10" />
            <img
              src={product.image || '/src/assets/main.png'}
              alt={product.name}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.src = '/src/assets/main.png';
              }}
            />
          </div>
          
          <div className="absolute top-3 right-3 z-20 flex items-center space-x-2">
            {isAdmin && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(product);
                  }}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-full shadow-sm hover:shadow transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteModal(true);
                  }}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-full shadow-sm hover:shadow transition-all"
                  disabled={loadingState}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </>
            )}
            <button
              onClick={() => navigate(`/product/${product.id}`)}
              className="p-2 bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white dark:hover:bg-dark-800 transition-colors"
              title="Batafsil ko'rish"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button
              onClick={handleLike}
              className="p-2 bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white dark:hover:bg-dark-800 transition-colors"
              aria-label={isLiked ? "Saralangandan olib tashlash" : "Saralanganga qo'shish"}
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
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex-grow truncate">
              {product.name}
            </h3>
            {isAdmin && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {product.forwards || 0} ulashilgan
              </div>
            )}
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>{product.type}</span>
            <span>{product.views || 0} ko'rildi</span>
          </div>
          <div className="mt-2">
            <p className="text-gray-600 dark:text-gray-400">
              {product.lowestPrice.toLocaleString()} - {product.highestPrice.toLocaleString()} so'm
            </p>
          </div>
          <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-dark-700">
            <button
              className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-dark-700 hover:bg-gray-50 dark:hover:bg-dark-600 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-dark-600 transition-colors"
              onClick={async () => {
                const productUrl = `${window.location.origin}/product/${product.id}`;
                window.open(
                  `https://t.me/share/url?` + 
                  `url=${encodeURIComponent(productUrl)}` +
                  `&text=${encodeURIComponent(product.name)}` +
                  `&image=${encodeURIComponent(product.image)}`,
                  '_blank'
                );
                // Increment forwards count
                if (product.id) {
                  try {
                    const productRef = doc(db, 'products', product.id);
                    await updateDoc(productRef, {
                      forwards: increment(1)
                    });
                  } catch (error) {
                    console.error('Error updating forwards count:', error);
                  }
                }
              }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.53-1.4.51-.46-.01-1.35-.26-2.01-.48-.81-.27-1.46-.42-1.4-.88.03-.24.37-.49 1.03-.74 4.03-1.75 6.72-2.91 8.07-3.48 3.85-1.63 4.64-1.91 5.17-1.92.11 0 .37.03.54.18.17.15.21.36.23.47-.01.06.01.24-.01.38z"/>
              </svg>
              Ulashish
            </button>
            <button
              className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-dark-700 hover:bg-gray-50 dark:hover:bg-dark-600 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-dark-600 transition-colors"
              onClick={() => {
                const productUrl = `${window.location.origin}/product/${product.id}`;
                const shareText = `${product.name}\n${productUrl}`;
                navigator.clipboard.writeText(shareText);
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Nusxa
            </button>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        productName={product.name}
      />
    </>
  );
};

export default ProductCard;
