import { Helmet } from 'react-helmet-async';

const Meta = ({ productDetail }) => {
  const defaultImage = "https://xzmtjxrgjcorslyfxxvm.supabase.co/storage/v1/object/public/qancha-products/favicon-16x16.png";
  const baseUrl = "https://qancha-uz.vercel.app";
  
  const defaultMeta = {
    title: "Qancha.uz - Kerak narxni shu yerdan toping!",
    description: "Qancha.uz - O'zbekistondagi keraklaringizni qandaydir buyurtma qilishni o'rganib oling",
    image: defaultImage,
    url: baseUrl
  };

  if (!productDetail) {
    return (
      <Helmet>
        <title>{defaultMeta.title}</title>
        <meta name="description" content={defaultMeta.description} />
        
        <link rel="canonical" href={defaultMeta.url} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={defaultMeta.url} />
        <meta property="og:title" content={defaultMeta.title} />
        <meta property="og:description" content={defaultMeta.description} />
        <meta property="og:image" content={defaultMeta.image} />
        <meta property="og:site_name" content="Qancha.uz" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={defaultMeta.url} />
        <meta name="twitter:title" content={defaultMeta.title} />
        <meta name="twitter:description" content={defaultMeta.description} />
        <meta name="twitter:image" content={defaultMeta.image} />
        
        {/* Additional Meta Tags */}
        <meta name="keywords" content="narxlar, buyurtma, kerak, qancha," />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Qancha.uz" />
        <meta name="geo.region" content="UZ" />
        <meta name="geo.placename" content="Jizzakh" />
      </Helmet>
    );
  }

  const productMeta = {
    url: `${baseUrl}/product/${productDetail.id}`,
    title: `${productDetail.name} - Qancha.uz`,
    description: `${productDetail.name} - Narxi: ${productDetail.lowestPrice?.toLocaleString()} - ${productDetail.highestPrice?.toLocaleString()} so'm`,
    image: productDetail.image || defaultImage,
    keywords: `${productDetail.name}, ${productDetail.type}, qancha.uz, narx, price`
  };

  return (
    <Helmet>
      <title>{productMeta.title}</title>
      <meta name="description" content={productMeta.description} />
      <meta name="keywords" content={productMeta.keywords} />
      
      <link rel="canonical" href={productMeta.url} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="product" />
      <meta property="og:url" content={productMeta.url} />
      <meta property="og:title" content={productMeta.title} />
      <meta property="og:description" content={productMeta.description} />
      <meta property="og:image" content={productMeta.image} />
      <meta property="og:site_name" content="Qancha.uz" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={productMeta.url} />
      <meta name="twitter:title" content={productMeta.title} />
      <meta name="twitter:description" content={productMeta.description} />
      <meta name="twitter:image" content={productMeta.image} />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Qancha.uz" />
      <meta name="geo.region" content="UZ" />
      <meta name="geo.placename" content="Jizzakh" />

      {/* Structured Data for Google */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": productDetail.name,
          "description": productMeta.description,
          "image": productMeta.image,
          "url": productMeta.url,
          "offers": {
            "@type": "AggregateOffer",
            "lowPrice": productDetail.lowestPrice,
            "highPrice": productDetail.highestPrice,
            "priceCurrency": "UZS",
            "availability": productDetail.isSellerAvailable ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
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
