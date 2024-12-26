import React from 'react';

const StoreList = ({ stores }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Stores</h3>
      <div className="space-y-3">
        {stores.map((store) => (
          <div key={store.id} className="flex items-center justify-between p-3 hover:bg-indigo-50/50 rounded-xl transition-all duration-300 group">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden">
                <img
                  src={store.logo}
                  alt={store.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <div className="font-medium text-gray-800 group-hover:text-indigo-600 transition-colors">{store.name}</div>
                <div className="text-sm text-gray-500">{store.location}</div>
              </div>
            </div>
            <button className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
              View Products
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreList;
