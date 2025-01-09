import { doc, getDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
  try {
    const { id } = req.query;
    
    // Fetch product data
    const docRef = doc(db, 'products', id);
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

    // Read the index.html template
    const html = `<!DOCTYPE html>
<html lang="uz">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${product.name} - Qancha.uz</title>
    
    <!-- Basic Meta Tags -->
    <meta name="title" content="${product.name} - Qancha.uz">
    <meta name="description" content="${description}">
    <meta name="keywords" content="${product.name}, ${product.type || ''}, ${product.category || ''}, qancha.uz, narx, price">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="product">
    <meta property="og:url" content="https://qancha-uz.vercel.app/product/${product.id}">
    <meta property="og:title" content="${product.name} - Qancha.uz">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${product.image}">
    <meta property="og:site_name" content="Qancha.uz">
    <meta property="og:locale" content="uz_UZ">
    
    <!-- Product Specific Meta Tags -->
    <meta property="product:price:amount" content="${product.lowestPrice || ''}">
    <meta property="product:price:currency" content="UZS">
    <meta property="product:availability" content="${product.availability || 'in stock'}">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="https://qancha-uz.vercel.app/product/${product.id}">
    <meta name="twitter:title" content="${product.name} - Qancha.uz">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${product.image}">
    
    <link rel="icon" type="image/png" href="/favicon.ico">
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
}
