import { Helmet } from 'react-helmet';

export const SEO = ({ title, description, keywords }) => {
  const defaultTitle = "Qancha.uz - Uzbekistan's Premier Marketplace";
  const defaultDescription = "Your trusted marketplace for buying and selling products in Uzbekistan. Find the best deals and connect with sellers near you.";
  const defaultKeywords = "marketplace, uzbekistan, online shopping, buy, sell, products, qancha";

  return (
    <Helmet>
      <title>{title || defaultTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title || defaultTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || defaultTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
    </Helmet>
  );
};
