import express from 'express';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './src/firebase.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the dist directory
app.use(express.static('dist'));

// Middleware to handle product pages
app.get('/product/:id', async (req, res) => {
  try {
    const productId = req.id;
    const docRef = doc(db, 'products', productId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const product = { id: docSnap.id, ...docSnap.data() };
      
      // Read the product template
      const templatePath = path.resolve(__dirname, 'dist', 'product', '_template.html');
      let html = fs.readFileSync(templatePath, 'utf-8');

      // Format price range
      const priceRange = product.lowestPrice && product.highestPrice
        ? `${product.lowestPrice.toLocaleString('uz-UZ')} - ${product.highestPrice.toLocaleString('uz-UZ')} so'm`
        : '';

      const description = priceRange
        ? `${product.name} - Narxi: ${priceRange}`
        : `${product.name} - Qancha.uz`;

      // Replace placeholders with actual product data
      html = html
        .replace(/%PRODUCT_TITLE%/g, `${product.name} - Qancha.uz`)
        .replace(/%PRODUCT_DESCRIPTION%/g, description)
        .replace(/%PRODUCT_IMAGE%/g, product.image || defaultImage)
        .replace(/%PRODUCT_URL%/g, `https://qancha-uz.vercel.app/product/${product.id}`)
        .replace(/%PRODUCT_PRICE%/g, product.lowestPrice?.toString() || '');

      res.send(html);
    } else {
      // If product not found, redirect to home page
      res.redirect('/');
    }
  } catch (error) {
    console.error('Error serving product page:', error);
    res.redirect('/');
  }
});

// Handle all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
