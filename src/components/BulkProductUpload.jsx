import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const BulkProductUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.type === 'application/json' || selectedFile.type === 'text/csv')) {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please select a valid JSON or CSV file');
      setFile(null);
    }
  };

  const processJsonData = async (jsonData) => {
    const productsRef = collection(db, 'products');
    let successCount = 0;
    let errorCount = 0;

    for (const product of jsonData) {
      try {
        await addDoc(productsRef, {
          name: product.name,
          lowestPrice: Number(product.lowestPrice || product.price),
          highestPrice: Number(product.highestPrice || product.price),
          description: product.description || '',
          type: product.type || product.category || '',
          image: product.image || product.imageUrl || '',
          createdAt: new Date().toISOString(),
        });
        successCount++;
      } catch (error) {
        console.error('Error adding product:', error);
        errorCount++;
      }
    }
    return { successCount, errorCount };
  };

  const processCsvData = (csvText) => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    const jsonData = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(',').map(value => value.trim());
      const product = {};
      
      headers.forEach((header, index) => {
        product[header] = values[index];
      });
      
      jsonData.push(product);
    }

    return jsonData;
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          let data;
          if (file.type === 'application/json') {
            data = JSON.parse(e.target.result);
          } else {
            data = processCsvData(e.target.result);
          }

          const { successCount, errorCount } = await processJsonData(data);
          setSuccess(`Successfully uploaded ${successCount} products. Failed: ${errorCount}`);
        } catch (error) {
          setError('Error processing file: ' + error.message);
        } finally {
          setLoading(false);
        }
      };

      reader.onerror = () => {
        setError('Error reading file');
        setLoading(false);
      };

      if (file.type === 'application/json') {
        reader.readAsText(file);
      } else {
        reader.readAsText(file);
      }
    } catch (error) {
      setError('Error uploading file: ' + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Bulk Product Upload</h2>
      <div className="mb-4">
        <input
          type="file"
          accept=".json,.csv"
          onChange={handleFileChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <p className="text-sm text-gray-500 mt-1">
          Accept JSON or CSV files only
        </p>
      </div>
      
      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className={`w-full py-2 px-4 rounded ${
          loading
            ? 'bg-gray-400'
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white font-semibold`}
      >
        {loading ? 'Uploading...' : 'Upload Products'}
      </button>

      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      <div className="mt-4">
        <h3 className="font-semibold mb-2">File Format:</h3>
        <p className="text-sm text-gray-600">
          JSON format:
          <pre className="bg-gray-100 p-2 rounded mt-1">
{`[
  {
    "name": "Product Name",
    "lowestPrice": 89.99,
    "highestPrice": 99.99,
    "description": "Product description",
    "type": "Technology",
    "image": "https://example.com/image.jpg"
  }
]`}
          </pre>
        </p>
        <p className="text-sm text-gray-600 mt-2">
          CSV format:
          <pre className="bg-gray-100 p-2 rounded mt-1">
            name,lowestPrice,highestPrice,description,type,image
          </pre>
        </p>
      </div>
    </div>
  );
};

export default BulkProductUpload;
