"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../../context/LanguageContext";
import { format, parseISO } from "date-fns";
import { de, fr, it } from "date-fns/locale";
import { useParams, useSearchParams } from "next/navigation";
import { fetchAllArticles } from "../../lib/articles";

// Define the MultilingualArticle interface here
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

// Date formatting with localization
const locales = {
  en: undefined,
  de: de,
  fr: fr,
  it: it,
};

export default function ArticlesPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const currentLang = (params?.lang as string) || "en";
  const tagParam = searchParams?.get("tag");

  const [articles, setArticles] = useState<MultilingualArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<
    MultilingualArticle[]
  >([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  // Set selected tag from URL param after component mounts to avoid hydration mismatch
  useEffect(() => {
    if (tagParam) {
      setSelectedTag(tagParam);
    }
  }, [tagParam]);

  // Load articles on component mount
  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true);
      try {
        // Use the client-side API function to fetch articles
        const allArticles = await fetchAllArticles(currentLang);

        if (allArticles && Array.isArray(allArticles)) {
          setArticles(allArticles);

          // Extract unique tags from articles
          const uniqueTags = new Set<string>();
          allArticles.forEach((article) => {
            if (article.tags && Array.isArray(article.tags)) {
              article.tags.forEach((tag) => uniqueTags.add(tag));
            }
          });
          setTags(Array.from(uniqueTags).sort());
        } else {
          console.error(
            "Unexpected response format for articles:",
            allArticles
          );
          setArticles([]);
          setTags([]);
        }
      } catch (error) {
        console.error("Error loading articles:", error);
        setArticles([]);
        setTags([]);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, [currentLang]);

  // Filter articles when a tag is selected
  useEffect(() => {
    if (selectedTag && articles.length > 0) {
      setFilteredArticles(
        articles.filter(
          (article) =>
            article.tags &&
            Array.isArray(article.tags) &&
            article.tags.includes(selectedTag)
        )
      );
    } else {
      setFilteredArticles(articles);
    }
  }, [selectedTag, articles]);

  // Client-side only date formatter to avoid hydration mismatches
  const formatDate = (dateString: string) => {
    if (typeof window === "undefined") {
      return dateString; // Return unformatted on server
    }

    try {
      const date = parseISO(dateString);
      return format(date, "MMMM d, yyyy", {
        locale: locales[language as keyof typeof locales],
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  // Display loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Show message if no articles found
  if (!articles.length) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">BJJ Articles</h1>
        <div className="text-center py-12">
          <p className="text-gray-500">
            No articles available in this language yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">
        {language === "en"
          ? "BJJ Articles"
          : language === "de"
          ? "BJJ Artikel"
          : language === "fr"
          ? "Articles de BJJ"
          : language === "it"
          ? "Articoli BJJ"
          : "BJJ Articles"}
      </h1>

      {/* Tags filter */}
      {tags.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">
            {language === "en"
              ? "Filter by Topics"
              : language === "de"
              ? "Nach Themen filtern"
              : language === "fr"
              ? "Filtrer par sujets"
              : language === "it"
              ? "Filtra per argomenti"
              : "Filter by Topics"}
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedTag === null
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-800"
              }`}
            >
              {language === "en"
                ? "All Topics"
                : language === "de"
                ? "Alle Themen"
                : language === "fr"
                ? "Tous les sujets"
                : language === "it"
                ? "Tutti gli argomenti"
                : "All Topics"}
            </button>

            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedTag === tag
                    ? "bg-gray-800 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Articles list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArticles.map((article) => (
          <Link
            href={`/${currentLang}/articles/${article.slug}`}
            key={article.id}
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
              {article.coverImage && (
                <div className="aspect-video relative">
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    priority={false}
                  />
                </div>
              )}

              <div className="p-5 flex-grow flex flex-col">
                <h2 className="text-xl font-bold mb-2 text-gray-900">
                  {article.title}
                </h2>
                <p className="text-gray-600 mb-4 flex-grow">
                  {article.excerpt}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {article.tags &&
                    article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500 mt-auto">
                  <span>{article.author}</span>
                  <span suppressHydrationWarning>
                    {formatDate(article.date)}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {language === "en"
              ? "No articles found with the selected tag."
              : language === "de"
              ? "Keine Artikel mit dem ausgewählten Tag gefunden."
              : language === "fr"
              ? "Aucun article trouvé avec le tag sélectionné."
              : language === "it"
              ? "Nessun articolo trovato con il tag selezionato."
              : "No articles found with the selected tag."}
          </p>
        </div>
      )}
    </div>
  );
}
