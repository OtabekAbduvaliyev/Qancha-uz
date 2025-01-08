import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

const Meta = ({ productDetail }) => {
  const defaultImage = "https://xzmtjxrgjcorslyfxxvm.supabase.co/storage/v1/object/public/qancha-products/favicon-16x16.png";
  const baseUrl = "https://qancha-uz.vercel.app";
  
  const defaultMeta = {
    url: "https://qancha-uz.vercel.app",
    title: "Qancha.uz - Kerak narxni shu yerdan toping!",
    description: "Your trusted marketplace for buying and selling products in Uzbekistan. Find the best deals and connect with sellers near you.",
    image: defaultImage,
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
  console.log(metaContent);
 if(!productDetail) {
    return (
      <Helmet>
        <title>{defaultMeta.title}</title>
        <meta name="title" content={defaultMeta.title} />
        <meta name="description" content={defaultMeta.description} />
        <meta name="keywords" content={defaultMeta.keywords} />
        
        <link rel="canonical" href={defaultMeta.url} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={defaultMeta.url} />
        <meta property="og:title" content={defaultMeta.title} />
        <meta property="og:description" content={defaultMeta.description} />
        <meta property="og:image" content={defaultMeta.image} />
        <meta property="og:site_name" content="Qancha.uz" />
        <meta property="og:locale" content="uz_UZ" />
      </Helmet>
    );
  }

  return (
    <Helmet>
      <title>{metaContent.title}</title>
      <meta name="title" content={metaContent.title} />
      <meta name="description" content={metaContent.description} />
      <meta name="keywords" content={metaContent.keywords} />
      
      <link rel="canonical" href={metaContent.url} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="artcile" />
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

      {/* Schema.org structured data */}
      <script type="application/ld+json">
        {JSON.stringify(
          productDetail ? {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": productDetail.name,
            "description": metaContent.description,
            "image": productDetail.image || defaultImage,
            "offers": {
              "@type": "AggregateOffer",
              "priceCurrency": "UZS",
              "lowPrice": productDetail.lowestPrice || 0,
              "highPrice": productDetail.highestPrice || 0,
              "offerCount": productDetail.offerCount || 1,
              "availability": "http://schema.org/OutOfStock"
            },
            "aggregateRating": productDetail.rating ? {
              "@type": "AggregateRating",
              "ratingValue": productDetail.rating,
              "reviewCount": productDetail.reviewCount || 0
            } : undefined,
            "review": productDetail.reviews ? productDetail.reviews.map(review => ({
              "@type": "Review",
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": review.rating
              },
              "author": {
                "@type": "Person",
                "name": review.author
              },
              "reviewBody": review.content
            })) : undefined
          } : {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "url": baseUrl,
            "name": defaultMeta.title,
            "description": defaultMeta.description,
            "image": defaultMeta.image
          }
        )}
      </script>
    </Helmet>
  );
};

export default Meta;
