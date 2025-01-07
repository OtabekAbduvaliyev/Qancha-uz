import React from 'react';
import { Helmet } from 'react-helmet-async';

const Meta = ({ productDetail }) => {
  const defaultImage = "https://xzmtjxrgjcorslyfxxvm.supabase.co/storage/v1/object/public/qancha-products/favicon-16x16.png";
  const baseUrl = "https://qancha-uz.vercel.app";
  
  const defaultMeta = {
    title: "Qancha.uz - Kerak narxni shu yerdan toping!",
    description: "Your trusted marketplace for buying and selling products in Uzbekistan. Find the best deals and connect with sellers near you.",
    image: defaultImage,
    url: baseUrl,
    keywords: "marketplace, uzbekistan, online shopping, buy, sell, products, qancha, tashkent"
  };

  const metaContent = productDetail ? {
    url: `${baseUrl}/product/${productDetail.id}`,
    title: `${productDetail.name} - Qancha.uz`,
    description: `${productDetail.name} - Narxi: ${productDetail.lowestPrice?.toLocaleString()} - ${productDetail.highestPrice?.toLocaleString()} so'm`,
    image: productDetail.image || defaultImage,
    keywords: `${productDetail.name}, ${productDetail.type}, qancha.uz, narx, price`
  } : defaultMeta;

  return (
    <Helmet prioritizeSeoTags={true}>
      <title>{metaContent.title}</title>
      <meta name="description" content={metaContent.description} />
      <meta name="keywords" content={metaContent.keywords} />
      
      {/* OpenGraph Meta Tags */}
      <meta property="og:title" content={metaContent.title} />
      <meta property="og:description" content={metaContent.description} />
      <meta property="og:image" content={metaContent.image} />
      <meta property="og:url" content={metaContent.url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Qancha.uz" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaContent.title} />
      <meta name="twitter:description" content={metaContent.description} />
      <meta name="twitter:image" content={metaContent.image} />
      
      {/* Additional Meta Tags */}
      <link rel="canonical" href={metaContent.url} />
      <meta name="robots" content="index, follow" />
      <meta httpEquiv="content-language" content="uz" />
    </Helmet>
  );
};

export default Meta;
