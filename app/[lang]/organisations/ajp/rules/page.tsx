"use client";

import React, { useEffect, useState } from "react";
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

export default function AjpRulesPage() {
  const { language } = useLanguage();
  const [article, setArticle] = useState<MultilingualArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log(`Loading AJP rules for language: ${language}`);
        const data = await fetchRuleBySlug("ajp-rules", language);
        console.log("Fetched data:", data);
        if (data) {
          setArticle(data);
        } else {
          setError("No content found");
        }
      } catch (error) {
        console.error("Error loading AJP rules:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [language]);

  // Get localized back button text
  const getBackButtonText = () => {
    switch (language) {
      case "de":
        return "Zurück zu den Organisationen";
      case "fr":
        return "Retour aux organisations";
      case "it":
        return "Torna alle organizzazioni";
      default:
        return "Back to Organizations";
    }
  };

  // Get localized not found text
  const getNotFoundText = () => {
    switch (language) {
      case "de":
        return "Inhalt nicht gefunden";
      case "fr":
        return "Contenu non trouvé";
      case "it":
        return "Contenuto non trovato";
      default:
        return "Content not found";
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href={`/${language}/organisations`}
        className="flex items-center text-blue-600 mb-6"
      >
        <ArrowLeft size={16} className="mr-2" />
        {getBackButtonText()}
      </Link>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      ) : article ? (
        <div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
            {article.excerpt && (
              <div className="text-gray-600">{article.excerpt}</div>
            )}
          </div>

          <div className="prose max-w-none">
            <MarkdownRenderer content={article.content || ""} />
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-600">{getNotFoundText()}</div>
        </div>
      )}
    </div>
  );
}
