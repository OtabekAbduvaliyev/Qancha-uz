import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

const Meta = ({ productDetail }) => {
  const [metaData, setMetaData] = useState(null);

  useEffect(() => {
    if (productDetail) {
      const productMeta = {
        url: `https://qancha-uz.vercel.app/product/${productDetail.id}`,
        title: `${productDetail.name} - Qancha.uz`,
        description: `${productDetail.name} - Narxi: ${productDetail.lowestPrice?.toLocaleString()} - ${productDetail.highestPrice?.toLocaleString()} so'm`,
        image: productDetail.image || "https://xzmtjxrgjcorslyfxxvm.supabase.co/storage/v1/object/public/qancha-products/favicon-16x16.png",
        keywords: `${productDetail.name}, ${productDetail.type}, qancha.uz, narx, price`
      };

      setMetaData(productMeta);
    }
  }, [productDetail]);

  if (!metaData) return null; // Don't render meta until data is available

  return (
    <Helmet>
      <title>{metaData.title}</title>
      <meta name="title" content={metaData.title} />
      <meta name="description" content={metaData.description} />
      <meta name="keywords" content={metaData.keywords} />
      
      <link rel="canonical" href={metaData.url} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="product" />
      <meta property="og:url" content={metaData.url} />
      <meta property="og:title" content={metaData.title} />
      <meta property="og:description" content={metaData.description} />
      <meta property="og:image" content={metaData.image} />
      <meta property="og:site_name" content="Qancha.uz" />
      <meta property="og:locale" content="uz_UZ" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={metaData.url} />
      <meta name="twitter:title" content={metaData.title} />
      <meta name="twitter:description" content={metaData.description} />
      <meta name="twitter:image" content={metaData.image} />
    </Helmet>
  );
};

export default Meta;
