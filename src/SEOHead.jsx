// SEOHead.jsx - Dynamic Meta Tags Component
// Install: npm install react-helmet-async
// Then wrap your App with <HelmetProvider> in main.jsx

import { Helmet } from 'react-helmet-async';

export function SEOHead({ 
  title = "WealthDelulu - Financial Education Without BS | Free Calculators & Articles",
  description = "Learn personal finance, investing, and retirement planning in plain English. Free compound interest calculator, budget tool, and no-jargon financial education for real people.",
  keywords = "personal finance, financial education, compound interest calculator, retirement planning, budget tool, investing for beginners",
  canonical = "https://wealthdelulu.com/",
  ogImage = "https://wealthdelulu.com/og-image.jpg",
  ogType = "website",
  article = null, // For article-specific schema
  calculator = null, // For calculator-specific schema
}) {
  const fullTitle = title.includes('WealthDelulu') ? title : `${title} - WealthDelulu`;
  
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Article Schema */}
      {article && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": article.title,
            "description": article.subtitle,
            "author": {
              "@type": "Organization",
              "name": "WealthDelulu"
            },
            "publisher": {
              "@type": "Organization",
              "name": "WealthDelulu",
              "logo": {
                "@type": "ImageObject",
                "url": "https://wealthdelulu.com/logo.png"
              }
            },
            "datePublished": "2026-03-20",
            "dateModified": "2026-03-31",
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": canonical
            }
          })}
        </script>
      )}
      
      {/* Calculator Schema */}
      {calculator && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": calculator.name,
            "applicationCategory": "FinanceApplication",
            "description": calculator.description,
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })}
        </script>
      )}
    </Helmet>
  );
}

// Pre-built SEO configurations for each page
export const SEO_CONFIG = {
  home: {
    title: "WealthDelulu - Financial Education Without BS | Free Calculators & Articles",
    description: "Learn personal finance, investing, and retirement planning in plain English. Free compound interest calculator, budget tool, and no-jargon financial education for real people.",
    keywords: "personal finance, financial education, compound interest calculator, retirement planning, budget tool, investing for beginners, money management, wealth building",
    canonical: "https://wealthdelulu.com/",
  },
  
  articles: {
    title: "Financial Education Articles - WealthDelulu",
    description: "Free personal finance articles covering investing, budgeting, retirement planning, and wealth building. No jargon, just practical money advice that works.",
    keywords: "personal finance articles, investing guide, budgeting tips, retirement planning, financial literacy, money management",
    canonical: "https://wealthdelulu.com/#articles",
  },
  
  calculators: {
    title: "Free Financial Calculators - Compound Interest, Retirement & More",
    description: "Free calculators for compound interest, retirement planning, mortgage payments, and budgeting. No sign-up required. See your financial future in seconds.",
    keywords: "compound interest calculator, retirement calculator, mortgage calculator, budget calculator, investment calculator, financial planning tools",
    canonical: "https://wealthdelulu.com/#calcs",
    calculator: {
      name: "WealthDelulu Financial Calculator Suite",
      description: "Free financial calculators for compound interest, retirement, mortgages, and budgets"
    }
  },
  
  budget: {
    title: "Free Budget Calculator & Tracker - WealthDelulu",
    description: "Track your income and expenses with our free budget calculator. Simple 50/30/20 rule calculator to balance your spending and savings goals.",
    keywords: "budget calculator, budget tracker, 50/30/20 rule, expense tracking, personal budget tool, money management",
    canonical: "https://wealthdelulu.com/#budget",
    calculator: {
      name: "Budget Calculator & Tracker",
      description: "Free budget tracking tool using the 50/30/20 rule"
    }
  },
  
  waitlist: {
    title: "Join the Waitlist - WealthDelulu Pro Features Coming Soon",
    description: "Be first to access premium features: net worth tracking, personalized financial insights, and advanced budget tools. Join 1,000+ people on the waitlist.",
    keywords: "financial app, net worth tracker, personal finance app, budget app, wealth tracking",
    canonical: "https://wealthdelulu.com/#waitlist",
  },
};

// Individual article SEO generator
export function getArticleSEO(article) {
  return {
    title: `${article.title} - WealthDelulu`,
    description: article.subtitle,
    keywords: `${article.tag.toLowerCase()}, personal finance, ${article.title.toLowerCase()}, financial education`,
    canonical: `https://wealthdelulu.com/article/${article.id}`,
    article: {
      title: article.title,
      subtitle: article.subtitle,
    }
  };
}
