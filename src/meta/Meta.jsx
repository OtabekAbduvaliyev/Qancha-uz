import React from 'react';
import { Helmet } from 'react-helmet-async';

const Meta = ({ productDetail }) => {
  const defaultImage = "https://xzmtjxrgjcorslyfxxvm.supabase.co/storage/v1/object/public/qancha-products/favicon-16x16.png";
  const baseUrl = "https://qancha-uz.vercel.app";
  
  const defaultMeta = {
    url: baseUrl,
    title: "Qancha.uz - Kerak narxni shu yerdan toping!",
    description: "Your trusted marketplace for buying and selling products in Uzbekistan. Find the best deals and connect with sellers near you.",
    image: defaultImage,
    keywords: "marketplace, uzbekistan, online shopping, buy, sell, products, qancha, tashkent"
  };

  const formatPrice = (price) => {
    return price ? price.toLocaleString('uz-UZ') : '';
  };

  const getProductMeta = () => {
    if (!productDetail) return defaultMeta;

    const priceRange = productDetail.lowestPrice || productDetail.highestPrice
      ? `${formatPrice(productDetail.lowestPrice)} - ${formatPrice(productDetail.highestPrice)} so'm`
      : '';

    const description = priceRange
      ? `${productDetail.name} - Narxi: ${priceRange}`
      : `${productDetail.name} - Qancha.uz`;

    return {
      url: `${baseUrl}/product/${productDetail.id}`,
      title: `${productDetail.name} - Qancha.uz`,
      description: description,
      image: productDetail.image || defaultImage,
      keywords: `${productDetail.name}, ${productDetail.type || ''}, ${productDetail.category || ''}, qancha.uz, narx, price`,
      price: productDetail.lowestPrice || '',
      currency: 'UZS',
      availability: productDetail.availability || 'in stock'
    };
  };

  const meta = getProductMeta();

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{meta.title}</title>
      <meta name="title" content={meta.title} />
      <meta name="description" content={meta.description} />
      <meta name="keywords" content={meta.keywords} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={meta.url} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={productDetail ? 'product' : 'website'} />
      <meta property="og:url" content={meta.url} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={meta.image} />
      <meta property="og:site_name" content="Qancha.uz" />
      <meta property="og:locale" content="uz_UZ" />

      {/* Product Specific Meta Tags */}
      {productDetail && (
        <>
          <meta property="product:price:amount" content={meta.price} />
          <meta property="product:price:currency" content={meta.currency} />
          <meta property="product:availability" content={meta.availability} />
        </>
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={meta.url} />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={meta.image} />
    </Helmet>
  );
};

export default Meta;
