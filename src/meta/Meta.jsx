import React, { useEffect } from 'react';
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
    description: productDetail.lowestPrice && productDetail.highestPrice 
      ? `${productDetail.name} - Narxi: ${productDetail.lowestPrice?.toLocaleString()} - ${productDetail.highestPrice?.toLocaleString()} so'm`
      : `${productDetail.name} - Qancha.uz`,
    image: productDetail.image || defaultImage,
    keywords: `${productDetail.name}, ${productDetail.type}, qancha.uz, narx, price`
  } : defaultMeta;

  useEffect(() => {
    // This effect can be used for any initialization if needed in the future
  }, [productDetail]);

  return (
    <Helmet>
      <title>{metaContent.title}</title>
      <meta name="title" content={metaContent.title} />
      <meta name="description" content={metaContent.description} />
      <meta name="keywords" content={metaContent.keywords} />
      
      <link rel="canonical" href={metaContent.url} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={metaContent.url} />
      <meta property="og:title" content={metaContent.title} />
      <meta property="og:description" content={metaContent.description} />
      <meta property="og:image" content={metaContent.image} />
      <meta property="og:site_name" content="Qancha.uz" />
      <meta property="og:locale" content="uz_UZ" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={metaContent.url} />
      <meta property="twitter:title" content={metaContent.title} />
      <meta property="twitter:description" content={metaContent.description} />
      <meta property="twitter:image" content={metaContent.image} />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Qancha.uz" />
      <meta name="language" content="Uzbek" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="geo.region" content="UZ" />
      <meta name="geo.placename" content="Tashkent" />

      {/* Structured Data for Google */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": metaContent.title,
          "description": metaContent.description,
          "image": metaContent.image,
          "url": metaContent.url,
          "offers": {
            "@type": "AggregateOffer",
            "lowPrice": productDetail?.lowestPrice,
            "highPrice": productDetail?.highestPrice,
            "priceCurrency": "UZS",
            "availability": productDetail?.isSellerAvailable ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
          },
          "brand": {
            "@type": "Brand",
            "name": "Qancha.uz"
          }
        })}
      </script>
    </Helmet>
  );
};

export default Meta;
