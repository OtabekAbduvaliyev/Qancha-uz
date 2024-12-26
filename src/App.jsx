import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import SearchBar from './components/SearchBar'
import ProductList from './components/ProductList'
import { AuthProvider } from './contexts/AuthContext'
import { db } from './firebase'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import { SEO } from './components/SEO';

const ITEMS_PER_PAGE = 12;

function App() {
  const [allProducts, setAllProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const products = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Format prices as strings with commas
          lowestPrice: doc.data().lowestPrice.toLocaleString(),
          highestPrice: doc.data().highestPrice.toLocaleString(),
        }));
        setAllProducts(products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <SEO />
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="py-6">
            <SearchBar onSearch={handleSearch} />
            <div className="max-w-[1200px] mx-auto px-6 mt-8">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading products...</p>
                </div>
              ) : (
                <>
                  <ProductList 
                    products={displayedProducts} 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                  
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-8 space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => handlePageChange(i + 1)}
                          className={`px-4 py-2 text-sm font-medium rounded-md ${
                            currentPage === i + 1
                              ? 'bg-gray-900 text-white'
                              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </AuthProvider>
    </>
  )
}

export default App
