// Structured Data Helpers for Schema.org markup

export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Condom.life",
    "url": "https://condom.life",
    "logo": "https://condom.life/images/logo.png",
    "description": "Global community for condom reviews and ratings",
    "sameAs": [
      "https://twitter.com/condomlife",
      "https://facebook.com/condomlife"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "email": "support@condom.life"
    }
  };
};

export const generateWebsiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Condom.life",
    "url": "https://condom.life",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://condom.life/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
};

export const generateProductSchema = (product) => {
  if (!product) return null;
  
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image_url,
    "brand": {
      "@type": "Brand",
      "name": product.brand_name
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.avg_rating,
      "reviewCount": product.review_count,
      "bestRating": "5",
      "worstRating": "1"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  };
};

export const generateReviewSchema = (review, product) => {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "Product",
      "name": product.name
    },
    "author": {
      "@type": "Person",
      "name": review.username || "Anonymous User"
    },
    "datePublished": review.created_at,
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": review.rating,
      "bestRating": "5",
      "worstRating": "1"
    },
    "reviewBody": review.comment
  };
};

export const generateBreadcrumbSchema = (breadcrumbs) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `https://condom.life${crumb.url}`
    }))
  };
};

export const generateArticleSchema = (article) => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "image": article.image,
    "datePublished": article.publishedDate,
    "dateModified": article.modifiedDate,
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Condom.life",
      "logo": {
        "@type": "ImageObject",
        "url": "https://condom.life/images/logo.png"
      }
    }
  };
};

export const generateFAQSchema = (faqs) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};