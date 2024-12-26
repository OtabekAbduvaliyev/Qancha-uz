import React from 'react';

const PriceChart = ({ priceData }) => {
  const maxPrice = Math.max(...priceData.map(s => s.price));
  
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Price Comparison</h3>
      <div className="space-y-6">
        {priceData.map((store) => (
          <div key={store.id} className="group">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600 group-hover:text-indigo-600 transition-colors">{store.name}</span>
              <span className="text-sm font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                {store.price.toLocaleString()} UZS
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-500 group-hover:bg-indigo-500"
                style={{
                  width: `${(store.price / maxPrice) * 100}%`
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceChart;
