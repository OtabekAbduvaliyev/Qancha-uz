import { doc, getDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function middleware(request) {
  const url = new URL(request.url);
  
  // Only run this middleware for product pages
  if (!url.pathname.startsWith('/product/')) {
    return;
  }

  try {
    // Extract product ID from URL
    const productId = url.pathname.split('/')[2];
    
    // Fetch product data from Firestore
    const docRef = doc(db, 'products', productId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return;
    }

    const product = { id: docSnap.id, ...docSnap.data() };

    // Format price range
    const priceRange = product.lowestPrice && product.highestPrice
      ? `${product.lowestPrice.toLocaleString('uz-UZ')} - ${product.highestPrice.toLocaleString('uz-UZ')} so'm`
      : '';

    const description = priceRange
      ? `${product.name} - Narxi: ${priceRange}`
      : `${product.name} - Qancha.uz`;

    // Get the response
    const response = await fetch(request);
    const html = await response.text();

    // Replace meta tags
    const modifiedHtml = html
      .replace(/<title>.*?<\/title>/, `<title>${product.name} - Qancha.uz</title>`)
      .replace(/<meta name="description".*?>/, `<meta name="description" content="${description}">`)
      .replace(/<meta property="og:title".*?>/, `<meta property="og:title" content="${product.name} - Qancha.uz">`)
      .replace(/<meta property="og:description".*?>/, `<meta property="og:description" content="${description}">`)
      .replace(/<meta property="og:image".*?>/, `<meta property="og:image" content="${product.image}">`)
      .replace(/<meta property="og:url".*?>/, `<meta property="og:url" content="https://qancha-uz.vercel.app/product/${product.id}">`)
      .replace(/<meta property="og:type".*?>/, `<meta property="og:type" content="product">`);

    return new Response(modifiedHtml, {
      headers: {
        'content-type': 'text/html',
        'cache-control': 'public, max-age=0, must-revalidate'
      }
    });
  } catch (error) {
    console.error('Error in middleware:', error);
    return;
  }
}

export const config = {
  matcher: '/product/:path*'
};
