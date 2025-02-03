import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const defaultMeta = {
  title: "Qancha.uz - O'zbekistondagi barcha maxsulotlar narxlari",
  description: "O‘zbekiston bo‘ylab mahsulot narxlarini osongina toping. Eng yaxshi takliflarni ko‘ring va narxlarni solishtiring",
  image: "https://xzmtjxrgjcorslyfxxvm.supabase.co/storage/v1/object/public/qancha-products/favicon-16x16.png",
  url: "https://qancha-uz.vercel.app",
  keywords: "marketplace, uzbekistan, online shopping, buy, sell, products, qancha, tashkent"
};

async function injectMeta() {
  try {
    const templatePath = path.resolve(__dirname, 'dist', 'index.html');
    let template = fs.readFileSync(templatePath, 'utf-8');

    // Create a copy of index.html for product routes
    const productTemplate = template
      .replace(/<title>.*?<\/title>/, '<title>%PRODUCT_TITLE%</title>')
      .replace('</head>', `
    <meta name="title" content="%PRODUCT_TITLE%" />
    <meta name="description" content="%PRODUCT_DESCRIPTION%" />
    <meta property="og:title" content="%PRODUCT_TITLE%" />
    <meta property="og:description" content="%PRODUCT_DESCRIPTION%" />
    <meta property="og:image" content="%PRODUCT_IMAGE%" />
    <meta property="og:type" content="product" />
    <meta property="og:url" content="%PRODUCT_URL%" />
    <meta property="product:price:amount" content="%PRODUCT_PRICE%" />
    <meta property="product:price:currency" content="UZS" />
    <meta property="og:site_name" content="Qancha.uz" />
    <meta property="og:locale" content="uz_UZ" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="%PRODUCT_TITLE%" />
    <meta name="twitter:description" content="%PRODUCT_DESCRIPTION%" />
    <meta name="twitter:image" content="%PRODUCT_IMAGE%" />
    </head>`);

    // Ensure product routes directory exists
    const productDir = path.resolve(__dirname, 'dist', 'product');
    if (!fs.existsSync(productDir)) {
      fs.mkdirSync(productDir, { recursive: true });
    }

    // Save the product template
    fs.writeFileSync(path.resolve(productDir, '_template.html'), productTemplate);

    // Update the main index.html with default meta tags
    const metaTags = `
    <title>${defaultMeta.title}</title>
    <meta name="title" content="${defaultMeta.title}" />
    <meta name="description" content="${defaultMeta.description}" />
    <meta name="keywords" content="${defaultMeta.keywords}" />
    <link rel="canonical" href="${defaultMeta.url}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${defaultMeta.url}" />
    <meta property="og:title" content="${defaultMeta.title}" />
    <meta property="og:description" content="${defaultMeta.description}" />
    <meta property="og:image" content="${defaultMeta.image}" />
    <meta property="og:site_name" content="Qancha.uz" />
    <meta property="og:locale" content="uz_UZ" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${defaultMeta.url}" />
    <meta name="twitter:title" content="${defaultMeta.title}" />
    <meta name="twitter:description" content="${defaultMeta.description}" />
    <meta name="twitter:image" content="${defaultMeta.image}" />
    `;

    // Replace the existing title and insert meta tags in main index.html
    template = template.replace(/<title>.*?<\/title>/, '')
      .replace('</head>', `${metaTags}\n</head>`);

    fs.writeFileSync(templatePath, template);
    console.log('Successfully injected meta tags into index.html');
  } catch (error) {
    console.error('Error injecting meta tags:', error);
  }
}

injectMeta().catch(console.error);
