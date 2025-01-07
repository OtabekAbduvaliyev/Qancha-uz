import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { Helmet } from 'react-helmet-async';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const viewIncremented = useRef(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
          // Only increment view if not already done
          if (!viewIncremented.current) {
            await updateDoc(docRef, {
              views: increment(1)
            });
            viewIncremented.current = true;
          }
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <>
      <Helmet>
        <title>{product.name} - Qancha.uz</title>
        <meta name="description" content={`${product.name} - Narxi: ${product.lowestPrice.toLocaleString()} - ${product.highestPrice.toLocaleString()} so'm`} key="description" />
        <meta name="keywords" content={`${product.name}, ${product.type}, qancha.uz, narx, price`} key="keywords" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="product" key="og:type" />
        <meta property="og:url" content={`${window.location.origin}/product/${product.id}`} key="og:url" />
        <meta property="og:title" content={`${product.name} - Qancha.uz`} key="og:title" />
        <meta property="og:description" content={`Narxi: ${product.lowestPrice.toLocaleString()} - ${product.highestPrice.toLocaleString()} so'm`} key="og:description" />
        <meta property="og:image" content={product.image} key="og:image" />
        <meta property="og:site_name" content="Qancha.uz" key="og:site_name" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
        <meta name="twitter:url" content={`${window.location.origin}/product/${product.id}`} key="twitter:url" />
        <meta name="twitter:title" content={`${product.name} - Qancha.uz`} key="twitter:title" />
        <meta name="twitter:description" content={`Narxi: ${product.lowestPrice.toLocaleString()} - ${product.highestPrice.toLocaleString()} so'm`} key="twitter:description" />
        <meta name="twitter:image" content={product.imageUrl} key="twitter:image" />
        
        {/* Structured Data for Google */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "description": `${product.name} - Narxi: ${product.lowestPrice.toLocaleString()} - ${product.highestPrice.toLocaleString()} so'm`,
            "image": product.image,
            "url": `${window.location.origin}/product/${product.id}`,
            "offers": {
              "@type": "AggregateOffer",
              "lowPrice": product.lowestPrice,
              "highPrice": product.highestPrice,
              "priceCurrency": "UZS",
              "availability": product.isSellerAvailable ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
            },
            "brand": {
              "@type": "Brand",
              "name": "Qancha.uz"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Image Section */}
              <div className="lg:w-1/2">
                <div className="relative h-96 lg:h-full">
                  <img
                    src={product.image || '/src/assets/main.png'}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/src/assets/main.png';
                    }}
                  />
                </div>
              </div>

              {/* Content Section */}
              <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {product.type || 'Other'}
                    </span>
                  </div>

                  <div className="space-y-6">
                    {product.description && (
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">Mahsulot haqida</h2>
                        <p className="text-gray-600">{product.description}</p>
                      </div>
                    )}

                    {/* Seller Information Section */}

                    <div>
                      <h2 className="text-lg font-medium text-gray-900 mb-2">Narx oralig'i</h2>
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-500 mb-1">Minimal narx</p>
                          <p className="text-xl font-semibold text-gray-900">
                            {product.lowestPrice?.toLocaleString()} so'm
                          </p>
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-500 mb-1">Maksimal narx</p>
                          <p className="text-xl font-semibold text-gray-900">
                            {product.highestPrice?.toLocaleString()} so'm
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-lg font-medium text-gray-900 mb-2">Qo'shimcha ma'lumot</h2>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          {product.isSellerAvailable ? (
                            <>
                              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <div>
                                <p className="text-sm font-medium text-gray-900">Sotuvchi mavjud</p>
                                <p className="text-sm text-green-600">{product.phoneNumber}</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                              </svg>
                              <p className="text-sm text-gray-600">Sotuvchi mavjud emas</p>
                            </>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          Mahsulot {new Date(product.createdAt).toLocaleDateString('uz-UZ', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })} da qo'shilgan
                        </p>
                        <div className="text-sm text-gray-500 mb-4">
                          <span>{product.views || 0} marta ko'rildi</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => navigate('/')}
                    className="flex-1 inline-flex justify-center items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Orqaga
                  </button>
                  {user?.email === 'admin@gmail.com' && (
                    <button
                      onClick={() => navigate(`/edit/${product.id}`)}
                      className="flex-1 inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Tahrirlash
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
