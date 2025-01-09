import { doc, getDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyB9CRANBYIJYU0HbWMHT9Sq2CjtQ3N6Xew",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "qancha-uz.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "qancha-uz",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "qancha-uz.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "137963923440",
  appId: process.env.FIREBASE_APP_ID || "1:137963923440:web:6ce33f05827a06e389df35",
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-ZKC8P1LYDZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
  // Check if this is a bot/crawler
  const userAgent = req.headers['user-agent'] || '';
  const isBot = /bot|crawler|spider|pinterest|facebook|twitter|telegram/i.test(userAgent);

  if (!isBot) {
    // For regular users, redirect to the SPA
    res.writeHead(302, {
      Location: '/'
    });
    return res.end();
  }

  const url = new URL(req.url, `https://${req.headers.host}`);
  const pathParts = url.pathname.split('/');
  const productId = pathParts[pathParts.indexOf('product') + 1];

  if (!productId) {
    return res.status(404).send('Product ID not found');
  }

  try {
    // Fetch product data
    const docRef = doc(db, 'products', productId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return res.status(404).send('Product not found');
    }

    const product = { id: docSnap.id, ...docSnap.data() };

    // Format price range
    const priceRange = product.lowestPrice && product.highestPrice
      ? `${product.lowestPrice.toLocaleString('uz-UZ')} - ${product.highestPrice.toLocaleString('uz-UZ')} so'm`
      : '';

    const description = priceRange
      ? `${product.name} - Narxi: ${priceRange}`
      : `${product.name} - Qancha.uz`;

    // Construct meta tags with special attention to Telegram requirements
    const metaTags = `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${product.name} - Qancha.uz</title>
    
    <!-- Basic Meta Tags -->
    <meta name="title" content="${product.name} - Qancha.uz">
    <meta name="description" content="${description}">
    <link rel="canonical" href="https://qancha-uz.vercel.app/product/${product.id}">
    
    <!-- Open Graph Meta Tags (Facebook, Telegram, etc) -->
    <meta property="og:site_name" content="Qancha.uz">
    <meta property="og:type" content="product">
    <meta property="og:title" content="${product.name} - Qancha.uz">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${product.image}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:url" content="https://qancha-uz.vercel.app/product/${product.id}">
    <meta property="og:locale" content="uz_UZ">
    
    <!-- Product Specific Meta Tags -->
    <meta property="product:price:amount" content="${product.lowestPrice || ''}">
    <meta property="product:price:currency" content="UZS">
    <meta property="product:availability" content="${product.availability || 'in stock'}">
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@qancha_uz">
    <meta name="twitter:title" content="${product.name} - Qancha.uz">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${product.image}">
    <meta name="twitter:url" content="https://qancha-uz.vercel.app/product/${product.id}">
    
    <!-- Additional Meta Tags for Telegram -->
    <meta property="telegram:channel" content="@qancha_uz">
    <meta itemprop="name" content="${product.name} - Qancha.uz">
    <meta itemprop="description" content="${description}">
    <meta itemprop="image" content="${product.image}">`;

    // For bots, return a simple HTML with just meta tags
    const html = `<!DOCTYPE html>
<html lang="uz">
<head>
    ${metaTags}
</head>
<body>
    <h1>${product.name}</h1>
    <p>${description}</p>
    <img src="${product.image}" alt="${product.name}">
</body>
</html>`;

    // Set cache control headers
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
}
