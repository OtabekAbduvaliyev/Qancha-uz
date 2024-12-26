import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
      {products.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-600">No products found. Try a different search.</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
