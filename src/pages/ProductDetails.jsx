import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { Helmet } from 'react-helmet';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
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
        <title>{product.name}</title>
        <meta name="description" content={product.name} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="product" />
        <meta property="og:title" content={product.name} />
        <meta property="og:image" content={product.image} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={`${window.location.origin}/product/${product.id}`} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product.name} />
        <meta name="twitter:image" content={product.image} />
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
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">
                          Mahsulot {new Date(product.createdAt).toLocaleDateString('uz-UZ', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })} da qo'shilgan
                        </p>
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
