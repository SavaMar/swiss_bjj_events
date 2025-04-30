"use client";

import React from "react";
import { useLanguage } from "../context/LanguageContext";

// Define the article interface
interface Article {
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
  article: Article;
  translations?: {
    [key: string]: {
      slug: string;
      title: string;
    };
  };
}

const ArticleSeo: React.FC<ArticleSeoProps> = ({ article, translations }) => {
  const { language } = useLanguage();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const canonicalUrl = `${baseUrl}/${language}/articles/${article.slug}`;

  return (
    <>
      <title>{article.title} | Swiss BJJ</title>
      <meta name="description" content={article.excerpt} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={article.title} />
      <meta property="og:description" content={article.excerpt} />
      <meta property="og:url" content={canonicalUrl} />
      {article.coverImage && (
        <meta property="og:image" content={article.coverImage} />
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={article.title} />
      <meta name="twitter:description" content={article.excerpt} />
      {article.coverImage && (
        <meta name="twitter:image" content={article.coverImage} />
      )}

      {/* Article specific meta tags */}
      <meta property="article:published_time" content={article.date} />
      <meta property="article:author" content={article.author} />
      {article.tags.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Language alternates */}
      {translations &&
        Object.entries(translations).map(([lang, translation]) => (
          <link
            key={lang}
            rel="alternate"
            hrefLang={lang}
            href={`${baseUrl}/${lang}/articles/${translation.slug}`}
          />
        ))}
    </>
  );
};

export default ArticleSeo;
