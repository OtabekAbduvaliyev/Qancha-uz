import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { EditProductModal } from './EditProductModal';

const ProductList = ({ products, onProductUpdate }) => {
  const [editingProduct, setEditingProduct] = useState(null);

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleUpdate = (updatedProduct) => {
    if (onProductUpdate) {
      onProductUpdate(editingProduct.id, updatedProduct);
    }
    setEditingProduct(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product}
            onEdit={handleEdit}
          />
        ))}
        {products.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600">No products found. Try a different search.</p>
          </div>
        )}
      </div>

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
};

export default ProductList;
