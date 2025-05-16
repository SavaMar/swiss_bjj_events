"use client";

import React from "react";
import { useLanguage } from "../../../../context/LanguageContext";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import MarkdownRenderer from "../../../../components/MarkdownRenderer";
import { fetchRuleBySlug } from "../../../../lib/organisations";

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

export default function GrapplingIndustriesRulesPage() {
  const { language } = useLanguage();
  const [article, setArticle] = React.useState<MultilingualArticle | null>(
    null
  );

  React.useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await fetchRuleBySlug(
          "grappling-industries-rules",
          language
        );
        if (data) {
          setArticle(data);
        }
      } catch (error) {
        console.error("Error loading Grappling Industries rules:", error);
      }
    };

    loadContent();
  }, [language]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/organisations"
        className="flex items-center text-blue-600 mb-6"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Organizations
      </Link>

      {article && (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
            {article.excerpt && (
              <p className="text-gray-600">{article.excerpt}</p>
            )}
          </div>

          <div className="prose max-w-none">
            <MarkdownRenderer content={article.content || ""} />
          </div>
        </>
      )}
    </div>
  );
}
