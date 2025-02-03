import React from 'react';
import { Helmet } from 'react-helmet-async';

const Meta = ({ productDetail }) => {
  const defaultImage = "https://xzmtjxrgjcorslyfxxvm.supabase.co/storage/v1/object/public/qancha-products/favicon-16x16.png";
  const baseUrl = "https://qancha-uz.vercel.app";
  
  const defaultMeta = {
    url: baseUrl,
    title: "Qancha.uz - O'zbekistondagi barcha maxsulotlar narxlari",
    description: "O‘zbekiston bo‘ylab mahsulot narxlarini osongina toping. Eng yaxshi takliflarni ko‘ring va narxlarni solishtiring",
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
      <title>{meta.title}</title>
      <meta name="title" content={meta.title} />
      <meta name="description" content={meta.description} />
      <meta name="keywords" content={meta.keywords} />
      
      <link rel="canonical" href={meta.url} />
      
      <meta property="og:type" content={productDetail ? 'product' : 'website'} />
      <meta property="og:url" content={meta.url} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={meta.image} />
      <meta property="og:site_name" content="Qancha.uz" />
      <meta property="og:locale" content="uz_UZ" />

      {productDetail && (
        <>
          <meta property="product:price:amount" content={meta.price} />
          <meta property="product:price:currency" content={meta.currency} />
          <meta property="product:availability" content={meta.availability} />
        </>
      )}
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={meta.url} />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={meta.image} />
    </Helmet>
  );
};

export default Meta;
