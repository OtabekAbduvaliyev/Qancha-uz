import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import SearchBar from './components/SearchBar'
import ProductList from './components/ProductList'
import ProductFilter from './components/ProductFilter'
import ProductDetails from './pages/ProductDetails'
import { AuthProvider } from './contexts/AuthContext'
import { AlertProvider } from './contexts/AlertContext'
import { db } from './firebase'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import BulkProductUpload from './components/BulkProductUpload';
import { Helmet } from 'react-helmet-async';
import Meta from './meta/Meta'

const ITEMS_PER_PAGE = 12;

function App() {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get URL search params
  const searchParams = new URLSearchParams(window.location.search);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || null);
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);

  // Update URL when filters change
  const updateURL = (params) => {
    const newSearchParams = new URLSearchParams(window.location.search);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
    });

    const newURL = `${window.location.pathname}${newSearchParams.toString() ? '?' + newSearchParams.toString() : ''}`;
    window.history.pushState({}, '', newURL);
  };

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const products = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lowestPrice: doc.data().lowestPrice.toLocaleString(),
        highestPrice: doc.data().highestPrice.toLocaleString(),
      }));
      setAllProducts(products);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching products:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Update URL when filters change
  useEffect(() => {
    updateURL({
      search: searchTerm,
      type: selectedType,
      page: currentPage > 1 ? currentPage : null
    });
  }, [searchTerm, selectedType, currentPage]);

  // Get unique product types and convert to Uzbek
  const typeMapping = {
    'Food': 'Oziq-ovqat',
    'Technology': 'Texnologiya',
    'Clothing': 'Kiyim',
    'Health': 'Salomatlik',
    'Home': 'Uy-ro\'zg\'or',
    'Beauty': 'Go\'zallik',
    'Sports': 'Sport',
    'Books': 'Kitoblar',
    'Toys': 'O\'yinchoqlar',
    'Transport': 'Transport',
    'Other': 'Boshqa'
  };

  const productTypes = [...new Set(allProducts.map(product => product.type).filter(Boolean))]
    .map(type => ({
      en: type,
      uz: typeMapping[type] || type
    }));

  const filteredProducts = (allProducts || []).filter(product => {
    const matchesSearch = searchTerm 
      ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (typeMapping[product.type]?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        product.type.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesType = !selectedType || (
      selectedType.en 
        ? product.type === selectedType.en
        : product.type === selectedType
    );

    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductUpdate = (productId, updatedProduct) => {
    setAllProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === productId 
          ? { ...product, ...updatedProduct }
          : product
      )
    );
  };

  return (
    <Router>
      <AuthProvider>
        <AlertProvider>
<Meta />

          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/" element={
                <div className="py-6">
                  <SearchBar initialValue={searchTerm} onSearch={handleSearch} />
                  <div className="max-w-[1200px] mx-auto px-6 mt-8">
                    <ProductFilter
                      selectedType={selectedType}
                      onTypeChange={handleTypeChange}
                      productTypes={productTypes}
                    />
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
                          onProductUpdate={handleProductUpdate}
                          loading={loading}
                        />
                        
                        {!loading && totalPages > 1 && (
                          <div className="flex justify-center mt-8 space-x-2">
                            <button
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1}
                              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Previous
                            </button>
                            
                            {(() => {
                              let pages = [];
                              const maxVisible = 3;
                              let start = Math.max(1, currentPage - 1);
                              let end = Math.min(start + maxVisible - 1, totalPages);
                              
                              // Adjust start if we're at the end
                              if (end === totalPages) {
                                start = Math.max(1, end - maxVisible + 1);
                              }

                              // Add first page button if not in range
                              if (start > 1) {
                                pages.push(
                                  <button
                                    key="first"
                                    onClick={() => handlePageChange(1)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                  >
                                    1
                                  </button>
                                );
                                if (start > 2) {
                                  pages.push(
                                    <span key="dots1" className="px-2 py-2 text-gray-500">...</span>
                                  );
                                }
                              }

                              // Add page buttons
                              for (let i = start; i <= end; i++) {
                                pages.push(
                                  <button
                                    key={i}
                                    onClick={() => handlePageChange(i)}
                                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                                      currentPage === i
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                                    }`}
                                  >
                                    {i}
                                  </button>
                                );
                              }

                              // Add last page button if not in range
                              if (end < totalPages) {
                                if (end < totalPages - 1) {
                                  pages.push(
                                    <span key="dots2" className="px-2 py-2 text-gray-500">...</span>
                                  );
                                }
                                pages.push(
                                  <button
                                    key="last"
                                    onClick={() => handlePageChange(totalPages)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                  >
                                    {totalPages}
                                  </button>
                                );
                              }

                              return pages;
                            })()}

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
              } />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/bulk-upload" element={<BulkProductUpload />} />
            </Routes>
          </div>
        </AlertProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
