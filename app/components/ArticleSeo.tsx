"use client";

import React, { useEffect } from "react";

// Define the MultilingualArticle interface here instead of importing from server-side utility
interface MultilingualArticle {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  slug: string;
  tags: string[];
  coverImage?: string;
  content?: string;
  language: string;
  translations?: {
    [key: string]: {
      slug: string;
      title: string;
    };
  };
}

interface ArticleSeoProps {
  article: MultilingualArticle;
  translations: {
    language: string;
    slug: string;
    title: string;
  }[];
}

const ArticleSeo: React.FC<ArticleSeoProps> = ({ article, translations }) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://swissbjj.com";

  // Create canonical URL
  const canonicalUrl = `${baseUrl}/${article.language}/articles/${article.slug}`;

  // Prepare alternate URLs for hreflang tags
  const alternateUrls = translations.map((translation) => ({
    language: translation.language,
    url: `${baseUrl}/${translation.language}/articles/${translation.slug}`,
  }));

  // Set meta tags client-side
  useEffect(() => {
    // Set document title
    document.title = `${article.title} | Swiss BJJ`;

    // Create or update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute("content", article.excerpt);

    // Function to create or update meta tag
    const updateMetaTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    // Update Open Graph tags
    updateMetaTag("og:type", "article");
    updateMetaTag("og:title", article.title);
    updateMetaTag("og:description", article.excerpt);
    updateMetaTag("og:url", canonicalUrl);

    if (article.coverImage) {
      updateMetaTag("og:image", article.coverImage);
    }

    updateMetaTag("article:published_time", article.date);

    // Update Twitter card tags
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", article.title);
    updateMetaTag("twitter:description", article.excerpt);

    if (article.coverImage) {
      updateMetaTag("twitter:image", article.coverImage);
    }

    // Create or update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", canonicalUrl);

    // Set up hreflang links
    // First, remove any existing hreflang links to avoid duplicates
    document
      .querySelectorAll('link[rel="alternate"][hreflang]')
      .forEach((el) => el.remove());

    // Add hreflang links for each translation
    alternateUrls.forEach((alt) => {
      const link = document.createElement("link");
      link.setAttribute("rel", "alternate");
      link.setAttribute("hreflang", alt.language);
      link.setAttribute("href", alt.url);
      document.head.appendChild(link);
    });

    // Add default hreflang
    const defaultLink = document.createElement("link");
    defaultLink.setAttribute("rel", "alternate");
    defaultLink.setAttribute("hreflang", "x-default");
    defaultLink.setAttribute("href", `${baseUrl}/en/articles/${article.slug}`);
    document.head.appendChild(defaultLink);

    // Cleanup function
    return () => {
      // No need to clean up as these meta tags should persist
    };
  }, [article, translations, canonicalUrl, baseUrl]);

  // This component doesn't render anything visible
  return null;
};

export default ArticleSeo;
