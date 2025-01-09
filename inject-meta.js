import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const defaultMeta = {
  title: "Qancha.uz - Kerak narxni shu yerdan toping!",
  description: "Your trusted marketplace for buying and selling products in Uzbekistan. Find the best deals and connect with sellers near you.",
  image: "https://xzmtjxrgjcorslyfxxvm.supabase.co/storage/v1/object/public/qancha-products/favicon-16x16.png",
  url: "https://qancha-uz.vercel.app",
  keywords: "marketplace, uzbekistan, online shopping, buy, sell, products, qancha, tashkent"
};

async function injectMeta() {
  try {
    const templatePath = path.resolve(__dirname, 'dist', 'index.html');
    let template = fs.readFileSync(templatePath, 'utf-8');

    const metaTags = `
    <title>${defaultMeta.title}</title>
    <meta name="title" content="${defaultMeta.title}" />
    <meta name="description" content="${defaultMeta.description}" />
    <meta name="keywords" content="${defaultMeta.keywords}" />
    
    <link rel="canonical" href="${defaultMeta.url}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${defaultMeta.url}" />
    <meta property="og:title" content="${defaultMeta.title}" />
    <meta property="og:description" content="${defaultMeta.description}" />
    <meta property="og:image" content="${defaultMeta.image}" />
    <meta property="og:site_name" content="Qancha.uz" />
    <meta property="og:locale" content="uz_UZ" />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="${defaultMeta.url}" />
    <meta property="twitter:title" content="${defaultMeta.title}" />
    <meta property="twitter:description" content="${defaultMeta.description}" />
    <meta property="twitter:image" content="${defaultMeta.image}" />
    `;

    // Replace the existing title and insert meta tags
    template = template.replace(/<title>.*?<\/title>/, '')
      .replace('</head>', `${metaTags}\n</head>`);

    fs.writeFileSync(templatePath, template);
    console.log('Successfully injected meta tags into index.html');
  } catch (error) {
    console.error('Error injecting meta tags:', error);
  }
}

injectMeta().catch(console.error);
